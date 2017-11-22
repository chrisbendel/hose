import React, { Component } from 'react';
import './../../css/Player.css'

export default class Player extends Component {
  render() {
    return (
      <div className="Player">
        <div className="controls-container">
          <button className="button lg">
            <img className="icon play" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG8SURBVGhD7ZqtT8NAGMYLISQkCAQ4QkKybG0NweFAIfgPsCiCA0TbTdTgSHBIJMhZJP8BKBQKgyEEt4QsvLen9C2dIHx014/3uCd5xLbevffLffTeuzlWVlaTyQtp34/I549yBZBLN6ShF9F5+0gt8tfylIB4kVKJAfQCH2zGaoZ/lqNxkDGge3ibH5Ghr0ByU98PqcWPNlvfg3z0zpsb0akfq3ku0kz9BPLpkJ68Lu05sZrmos3Sr0HY6J1bt0sbXLw5+itIaiL4yg/UCldTv4qBZKYByveWD2mOq6tPk4GkxnB7xKKw6zhqiqutXjpActONF9A6V12t9ILAIb2jdy5aES1xiGqkHYQNmNdORMd4/8xyqHJVFkhmzJ8HxNjhcOWpbJDMALouNV2oCiQxhtsQ8c7WYrXA4fWpSpDc9AwovelCPSCpAXPXCdQWN2Uy1QmSm/rtHq1yk4qpGSCJaYAF4aRwumBBtFr40DJgsgtffo14IYrfoojfNGIYCd/Gm5FYCU91MQ+kHz6IPw4y4IAOw0j4kan0Q2xMYhOuFYRf9KAXZF+9ofGyL0PReCOup834w4CV1b+W44wA0zYhqYQBXh4AAAAASUVORK5CYII=" />
          </button>
        </div>
      </div>
    );
  }
}