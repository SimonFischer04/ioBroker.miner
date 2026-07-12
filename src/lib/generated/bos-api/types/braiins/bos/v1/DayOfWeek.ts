// Original file: bos/v1/units.proto

export const DayOfWeek = {
  DAY_OF_WEEK_UNSPECIFIED: 0,
  DAY_OF_WEEK_MONDAY: 1,
  DAY_OF_WEEK_TUESDAY: 2,
  DAY_OF_WEEK_WEDNESDAY: 3,
  DAY_OF_WEEK_THURSDAY: 4,
  DAY_OF_WEEK_FRIDAY: 5,
  DAY_OF_WEEK_SATURDAY: 6,
  DAY_OF_WEEK_SUNDAY: 7,
} as const;

export type DayOfWeek =
  | 'DAY_OF_WEEK_UNSPECIFIED'
  | 0
  | 'DAY_OF_WEEK_MONDAY'
  | 1
  | 'DAY_OF_WEEK_TUESDAY'
  | 2
  | 'DAY_OF_WEEK_WEDNESDAY'
  | 3
  | 'DAY_OF_WEEK_THURSDAY'
  | 4
  | 'DAY_OF_WEEK_FRIDAY'
  | 5
  | 'DAY_OF_WEEK_SATURDAY'
  | 6
  | 'DAY_OF_WEEK_SUNDAY'
  | 7

export type DayOfWeek__Output = typeof DayOfWeek[keyof typeof DayOfWeek]
