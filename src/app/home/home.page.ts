import { getCurrencySymbol } from '@angular/common';
import { Component } from '@angular/core';
export interface Bloqueio{
  Numero: number,
  Condicao: Boolean
}
export interface Plataforma{
  Nome: String,
  ContagemSul: number,
  ContagemNorte: number,
  LinhaBloqueio?: Bloqueio[]
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  public linhaBloqueio: Bloqueio[];
  public Plataformas: Plataforma[];


  constructor() {
    this.Plataformas = [
      { Nome:"1", 
        ContagemNorte:0.734, 
        ContagemSul:0.35, 
        LinhaBloqueio:  [ {Numero:1,Condicao: true},
                          {Numero:2,Condicao: false},
                          {Numero:3,Condicao: true},
                          {Numero:4,Condicao: false},
                          {Numero:5,Condicao: true},
                          {Numero:6,Condicao: true},
                          {Numero:7,Condicao: false},
                          {Numero:8,Condicao: true}],
      },
      {Nome:"2", 
      ContagemNorte:0.2, 
      ContagemSul:0.2, 
      LinhaBloqueio:  [ {Numero:1,Condicao: true},
                        {Numero:2,Condicao: false},
                        {Numero:3,Condicao: true}],
      },
      {Nome:"Terminal", ContagemNorte:0.652, ContagemSul:0.408}
    ];
  }

  public setCondicao(cond: Boolean){
    return cond ? "Ligado" : "Desligado";
  }

  public setPercentual(numero: number){
    let num = numero * 100;
    return num.toFixed(2);
  }


}
