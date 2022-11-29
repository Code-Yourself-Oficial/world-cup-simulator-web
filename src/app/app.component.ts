import { Component, OnInit } from '@angular/core';
import { Match, Team } from './models/Team';
import { TeamsService } from './services/teams.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(service: TeamsService) {
    service.getGroups().subscribe(groups => {
      this.groups = groups;
      this.populateKnockouts(groups);
    })
  }

  title = 'world-cup-simulator-web';
  groups!: Team[][]
  roundOf16!: Match[]
  quarter!: Match[]
  semi!: Match[]
  final!: Match
  winner!: Team

  ngOnInit() {
    this.initRoundOf16();
    this.initQuarter();
    this.initSemi();
    this.initFinal();
    this.initWinner();
  }

  onMoveTeam(groups: any) {
    this.populateKnockouts(groups);
    this.initQuarter();
    this.initSemi();
    this.initFinal();
    this.initWinner();
  }

  changeQuarter(lastMatch: number, winner: Team) {
    if(this.roundOf16[lastMatch].teamOne?.name == '' ||
      this.roundOf16[lastMatch].teamTwo?.name == '')
       return;

    var currentMatch = this.calculateNextMatch(lastMatch);
    var isTeamOneSide = this.isTeamOneSideNextMatch(lastMatch);

    if(isTeamOneSide)
      this.quarter[currentMatch].teamOne = winner;
    else 
      this.quarter[currentMatch].teamTwo = winner;

    var nextMatch = this.calculateNextMatch(currentMatch);
    var loser = this.roundOf16[lastMatch].teamOne!.name == winner.name ? 
      this.roundOf16[lastMatch].teamTwo : this.roundOf16[lastMatch].teamOne

    if(this.semi[nextMatch].teamOne == loser || this.semi[nextMatch].teamTwo == loser)
      this.changeSemi(currentMatch, winner!, loser);
  }

  changeSemi(lastMatch: number, winner: Team, loser: Team | undefined = undefined) {
    if(this.quarter[lastMatch].teamOne?.name == '' ||
      this.quarter[lastMatch].teamTwo?.name == '')
       return;

    var currentMatch = this.calculateNextMatch(lastMatch);
    var isTeamOneSide = this.isTeamOneSideNextMatch(lastMatch);

    if(isTeamOneSide)
      this.semi[currentMatch].teamOne = winner;
    else 
      this.semi[currentMatch].teamTwo = winner;

    if(loser == undefined)
      loser  = this.quarter[lastMatch].teamOne!.name == winner.name ? 
        this.quarter[lastMatch].teamTwo : this.quarter[lastMatch].teamOne

    if(this.final.teamOne == loser || this.final.teamTwo == loser)
      this.changeFinal(currentMatch, winner, loser);
  }

  changeFinal(lastMatch: number, winner: Team, loser: Team | undefined = undefined) {
    if(this.semi[lastMatch].teamOne?.name == '' ||
      this.semi[lastMatch].teamTwo?.name == '')
     return;

    switch (lastMatch) {
      case 0:
        this.final.teamOne = winner
        break;
      case 1:
        this.final.teamTwo = winner
        break;
    }

    if(loser == undefined)
      loser = this.semi[lastMatch].teamOne!.name == winner.name ? 
        this.semi[lastMatch].teamTwo : this.semi[lastMatch].teamOne

    if(this.winner == loser)
      this.changeWinner(winner);
  }

  changeWinner(winner: Team) {
    if(this.final.teamOne?.name == '' ||
    this.final.teamTwo?.name == '')

     return;
    this.winner = winner;
  }

  initRoundOf16() {
    this.roundOf16 = [];
    for(var i=0; i < 8; i++) {
      this.roundOf16[i] = {
        teamOne: { name: '', img: '' },
        teamTwo: { name: '', img: '' },
      }
    }
  }

  initQuarter() {
    this.quarter = [];
    for(var i=0; i < 4; i++) {
      this.quarter[i] = {
        teamOne: { name: '', img: '' },
        teamTwo: { name: '', img: '' },
      }
    }
  }

  initSemi() {
    this.semi = [];
    for(var i=0; i < 2; i++) {
      this.semi[i] = {
        teamOne: { name: '', img: '' },
        teamTwo: { name: '', img: '' },
      }
    }
  }

  initFinal() {
    this.final = {
      teamOne: { name: '', img: ''},
      teamTwo: { name: '', img: ''}
    }
  }

  initWinner() {
    this.winner = { name: '', img: ''}
  }

  getBackgroundStyle(team: any) {
    return {'background-image':' url('+ team?.img +')'}
  }

  populateKnockouts(groups: Team[][]) {
    this.roundOf16 = [];
    this.roundOf16.push({teamOne: groups[0][0], teamTwo: groups[1][1]});
    this.roundOf16.push({teamOne: groups[1][0], teamTwo: groups[0][1]});
    this.roundOf16.push({teamOne: groups[2][0], teamTwo: groups[3][1]});
    this.roundOf16.push({teamOne: groups[3][0], teamTwo: groups[2][1]});
    this.roundOf16.push({teamOne: groups[4][0], teamTwo: groups[5][1]});
    this.roundOf16.push({teamOne: groups[5][0], teamTwo: groups[4][1]});
    this.roundOf16.push({teamOne: groups[6][0], teamTwo: groups[7][1]});
    this.roundOf16.push({teamOne: groups[7][0], teamTwo: groups[6][1]});
  }

  calculateNextMatch(match: number) {
    switch(match)  
    {
      case 0:
        return 0;
      case 2:
        return 0;
      case 1:
        return 1; 
      case 3:
        return 1;
      case 4:
        return 2;
      case 6:
        return 2;
      case 5:
        return 3;
      case 7:
        return 3;
      default:
        return 0;
    }
  }

  isTeamOneSideNextMatch(lastMatch: number) {
    switch (lastMatch) {
      case 0:
      case 1:
      case 4:
      case 5:
        return true;
      case 2:
      case 3:
      case 6:
      case 7:
      default:
        return false;
    }
  }
}