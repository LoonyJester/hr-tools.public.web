import { Injectable } from '@angular/core';

@Injectable()
export class User {
    public name: string;
    public roles: Array<string>;
}