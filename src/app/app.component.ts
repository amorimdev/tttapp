import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import game from './app.game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public currentPlayer = 0;
  public board = game.createBoard();
  public winner = null;
  public clickable = true;

  constructor(private http: Http) { }

  restart() {
    this.board = game.createBoard();
    this.winner = null;
    this.currentPlayer = 0;
    this.clickable = true;
  }

  cellClicked(row, col) {
    if (this.board[row][col] === 0 || this.board[row][col] === 1 || this.winner != null || this.clickable === false) {
      return;
    }

    this.clickable = false;
    this.currentPlayer++;
    this.board[row][col] = this.currentPlayer % 2 ? 0 : 1;

    this.post().subscribe(data => this.botPlayer(data));
  }

  private post() {
    const boardState = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    this.board.forEach(function (value, index) {
      value.forEach(function (subvalue, subindex) {
        boardState[index][subindex] = subvalue === 0 ? 'X' : subvalue === 1 ? 'O' : '';
      });
    });

    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify({playerUnit: 'X', boardState: boardState});

    return this.http.post('https://tttapi-vaynard.c9users.io/move/', body, options);
  }

  private botPlayer(data) {
    data = JSON.parse(data._body);

    if (data.nextMove.length > 0) {
      this.board[Number(data.nextMove[1])][Number(data.nextMove[0])] = 1;
    }

    const checkResult = game.checkBoard(this.board);

    this.winner = checkResult ? checkResult.winner : data.tiedGame === true ? 2 : null;

    if (this.winner === null) {
      this.clickable = true;
    }

    this.currentPlayer++;
  }
}
