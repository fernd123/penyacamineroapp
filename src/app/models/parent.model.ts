export class Parent {
    id?: string;
    creationDate: string;
    active: boolean = true;
}

export function getDate() {
    let today: any = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; //January is 0! 
    let yyyy = today.getFullYear();
    let hour = today.getHours();
    let minutes = today.getMinutes();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    today = dd + '/' + mm + '/' + yyyy + ' ' + hour + ':' + minutes;
    return today;
}
