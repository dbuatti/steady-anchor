-- Migration: Recalculate habit XP with balanced rates
--
-- Old rates:
--   timer/seconds: 1 XP/sec
--   reps:          25 XP/rep
--   min (non-timer): 60 XP/min
--
-- New rates:
--   timer/seconds: 3 XP/sec
--   reps:          6 XP/rep
--   min (non-timer): 180 XP/min
--
-- Recalculation logic per completedtasks row:
--   If duration_used IS NOT NULL (timer habit): new_xp = duration_used * 3
--   Elif unit = 'reps':                          new_xp = habit_xp_earned * 6 / 25  (proportional)
--   Elif unit = 'min':                           new_xp = habit_xp_earned * 3       (180/60)
--   Else (dose / binary):                        new_xp = habit_xp_earned           (unchanged)

-- Helper: replicate the JS calculateHabitLevel logic in SQL
CREATE OR REPLACE FUNCTION calculate_habit_level_from_xp(p_xp NUMERIC)
RETURNS INTEGER AS $$
DECLARE
  v_level INTEGER := 1;
  v_remaining NUMERIC := p_xp;
  v_xp_needed NUMERIC;
BEGIN
  LOOP
    -- BASE=300, grows 1.5x per level, capped at 1200
    v_xp_needed := LEAST(ROUND(300.0 * POWER(1.5, v_level - 1)), 1200);
    IF v_remaining >= v_xp_needed THEN
      v_remaining := v_remaining - v_xp_needed;
      v_level := v_level + 1;
    ELSE
      RETURN v_level;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Recalculate and update user_habits
WITH recalculated AS (
  SELECT
    ct.user_id,
    ct.original_source AS habit_key,
    SUM(
      CASE
        WHEN ct.duration_used IS NOT NULL
          THEN ct.duration_used * 3                              -- timer: seconds × 3 XP/sec
        WHEN uh.unit = 'reps'
          THEN ROUND(COALESCE(ct.habit_xp_earned, 0) * 6.0 / 25.0)  -- reps: scale 25→6
        WHEN uh.unit = 'min'
          THEN COALESCE(ct.habit_xp_earned, 0) * 3              -- min: scale 60→180
        ELSE
          COALESCE(ct.habit_xp_earned, 0)                       -- dose/binary: unchanged
      END
    )::NUMERIC AS new_habit_xp
  FROM completedtasks ct
  JOIN user_habits uh
    ON uh.user_id = ct.user_id
   AND uh.habit_key = ct.original_source
  GROUP BY ct.user_id, ct.original_source
)
UPDATE user_habits uh
SET
  habit_xp   = GREATEST(r.new_habit_xp, 0),
  habit_level = calculate_habit_level_from_xp(GREATEST(r.new_habit_xp, 0))
FROM recalculated r
WHERE uh.user_id   = r.user_id
  AND uh.habit_key = r.habit_key;
