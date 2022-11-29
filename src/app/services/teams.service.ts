import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from '../models/Team';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  apiUrl = 'https://world-cup-api.azurewebsites.net/api/teams/groups'

  constructor(private httpClient: HttpClient) { }

  public getGroups() {
    return this.httpClient.get<Team[][]>(this.apiUrl)
  }
}
