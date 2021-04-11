import moment, { unitOfTime } from 'moment';

class DateService {
    private static instance: DateService;

    private constructor() {}

    public static get dateService(): DateService {
        !DateService.instance && (DateService.instance = new DateService());

        return DateService.instance;
    }

    public isSame(compareWith: Date, compareOn: Date | number, compareBy: unitOfTime.StartOf = 'day'): boolean {
        return moment(compareWith.getTime()).isSame(moment(compareOn), compareBy);
    }

    public diffFromNow(timestamp: Date | number | object): string {
        return moment(timestamp).fromNow();
    }

    public format(date: Date | number, format = 'MMMM Do YYYY, h:mm:ss a'): string {
        return moment(date).format(format);
    }

    public toDate(data: number | string = Date.now()): Date {
        return new Date(data);
    }
}

export const { dateService } = DateService;
