import moment from 'moment';

class DateService {
    private static instance: DateService;

    private constructor() {}

    public static get dateService(): DateService {
        !DateService.instance && (DateService.instance = new DateService());

        return DateService.instance;
    }

    public isSame(compareWith: Date, compareOn: Date | number): boolean {
        return moment(compareWith.getTime()).isSame(moment(compareOn), 'day');
    }

    public diffFromNow(timestamp: Date | number | object): string {
        return moment(timestamp).fromNow();
    }

    public format(date: Date | number): string {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    }

    public toDate(data: number | string = Date.now()): Date {
        return new Date(data);
    }
}

export const { dateService } = DateService;
