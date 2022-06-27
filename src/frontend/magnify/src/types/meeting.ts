export interface Meeting {
  id: string;
  name: string;

  start: string;
  end: string;

  held_on_sunday: boolean;
  held_on_monday: boolean;
  held_on_tuesday: boolean;
  held_on_wednesday: boolean;
  held_on_thursday: boolean;
  held_on_friday: boolean;
  held_on_saturday: boolean;

  start_time: string;
  expected_duration: number;
}
