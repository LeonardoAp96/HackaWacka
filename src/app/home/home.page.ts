import { getCurrencySymbol } from '@angular/common';
import { Component } from '@angular/core';
export interface Bloqueio{
  Numero: number,
  Condicao: Boolean
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {

  public linhaBloqueio: Bloqueio[];


  constructor() {
    this.linhaBloqueio = [
      {Numero:1,Condicao: true},
      {Numero:2,Condicao: false},
      {Numero:3,Condicao: true},
      {Numero:4,Condicao: true},
      {Numero:5,Condicao: true},
      {Numero:5,Condicao: true},
    ];
  }

  public setCondicao(cond: Boolean){
    return cond ? "Ligado" : "Desligado";
  }











}
