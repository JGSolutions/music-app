import { Pipe, PipeTransform } from "@angular/core";

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

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    return toHoursMinutesSeconds(value)
  }

}
