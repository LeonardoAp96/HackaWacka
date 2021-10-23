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

  private TIME_INTERVAL : number = 5000; //milisegundos

  public linhaBloqueio: Bloqueio[];
  public Plataformas: Plataforma[];
  private dataInicial: Date;
  private dataAtual: Date;
  
  routine = setInterval(this.rotina, this.TIME_INTERVAL);

  constructor() {
    this.dataInicial = new Date();  
    console.log("Date = " + this.dataInicial); 

    //Date = Tue Feb 05 2019 12:05:22 GMT+0530 (IST)  
    this.montarPlataforma();
  }
  
  private montarPlataforma(){
    this.Plataformas = [
      { Nome:"1", 
        ContagemNorte:0.734, 
        ContagemSul:0.35, 
        LinhaBloqueio:  [ {Numero:1,Condicao: true},
                          {Numero:2,Condicao: true},
                          {Numero:3,Condicao: true},
                          {Numero:4,Condicao: true},
                          {Numero:5,Condicao: false},
                          {Numero:6,Condicao: false},
                          {Numero:7,Condicao: false},
                          {Numero:8,Condicao: false}],
      },
      { Nome:"2", 
        ContagemNorte:0.2, 
        ContagemSul:0.2,
      },
      { Nome:"Terminal", 
        ContagemNorte:0.652, 
        ContagemSul:0.408
      }
    ];
  }

  public rotina(){
    this.dataAtual = new Date();
  }


  public setCondicao(cond: Boolean){
    return cond ? "Ligado" : "Desligado";
  }

  public setPercentual(numero: number){
    let num = numero * 100;
    return num.toFixed(2);
  }
}
