import { Pipe, PipeTransform } from "@angular/core";
import { IDurationType } from "models/song.types";

const toHoursMinutesSeconds = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let result = `${minutes
    .toString()
    .padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
  if (!!hours) {
    result = `${hours.toString()}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return result;
};

const formatTime = (secs: number): string => {
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = (secs - minutes * 60) || 0;

  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number, duration: IDurationType): string {
    if (duration === IDurationType.milliseconds) {
      return toHoursMinutesSeconds(Math.round(value / 1000));
    }
    return toHoursMinutesSeconds(Math.round(value));
  }

}
