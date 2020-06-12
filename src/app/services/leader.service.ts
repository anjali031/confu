import { Injectable } from '@angular/core';
import {Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  getLeaders(): Leader[] {
    return LEADERS;
  }
  constructor() { }

  getDish(id: string): Leader {
    return LEADERS.filter((leader) => (leader.id === id))[0];
  }

  getFeaturedDish(): Leader {
    return LEADERS.filter((leader) => leader.featured)[0];
  }
}
