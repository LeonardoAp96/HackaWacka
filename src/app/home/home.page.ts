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

  private TIME_INTERVAL : number = 3000; //milisegundos
  routine = setInterval(()=>this.rotina(), this.TIME_INTERVAL);
  public linhaBloqueio: Bloqueio[];
  public Plataformas: Plataforma[];
  public showData: String = "Oi";
  public noTrem: Boolean;
  public coefPassageiro: number;

  private dataInicial: Date;
  private dataAtual: Date;
  private countSimultationTime: number = 0;
  

  constructor() {
    this.dataInicial = this.dataAtual = new Date();  
    this.coefPassageiro = 5;
    this.ShowDataRotina();
    this.montarPlataforma();
  }
  

  private montarPlataforma(){
    this.Plataformas = [
      { Nome:"1", 
        ContagemNorte:0.1, 
        ContagemSul:0.1, 
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
        LinhaBloqueio: []
      }
    ];
  }
  
  private rotina(){
    this.dataAtual = new Date();
    this.ShowDataRotina();
    this.Simulação();
    this.countSimultationTime += 1;
  }

  private Simulação(){
    let countBloqueio = 0;
    let percentualPasgPlatNorte = 0;
    let percentualPasgPlatSul = 0;

    if(this.countSimultationTime%10 == 0){ //Passagem do trem
      for(let count = 0; count < this.Plataformas.length; count++){
        percentualPasgPlatNorte = this.Plataformas[count].ContagemNorte *0.1;
        percentualPasgPlatSul = this.Plataformas[count].ContagemNorte *0.1;
        
        this.Plataformas[count].ContagemNorte = this.setMinValue(percentualPasgPlatNorte);
        this.Plataformas[count].ContagemSul = this.setMinValue(percentualPasgPlatSul);
      }
    }
    else { //Entrada de passageiros
      countBloqueio = this.getQuantBloqueioLigado(this.Plataformas);

      for(let count = 0; count < this.Plataformas.length; count++){
        percentualPasgPlatNorte = this.Plataformas[count].ContagemNorte + this.getRandomPassageiro(countBloqueio);
        percentualPasgPlatSul = this.Plataformas[count].ContagemSul + this.getRandomPassageiro(countBloqueio);
        
        this.Plataformas[count].ContagemNorte = this.setMaxValue(this.Plataformas[count].ContagemNorte + this.getRandomPassageiro(countBloqueio));
        this.Plataformas[count].ContagemSul =  this.setMaxValue(this.Plataformas[count].ContagemSul + this.getRandomPassageiro(countBloqueio));
      };
    };
    this.AlgoritmoBloqueios();
  }

  private AlgoritmoBloqueios(){
    let somaOcupacao = 0;
    let qtdPlat = 0;

    this.Plataformas.forEach(pl=>{
      somaOcupacao += (pl.ContagemNorte + pl.ContagemNorte)/2;
      qtdPlat++;
    });

    
    const mediaOcupacao = somaOcupacao / qtdPlat;
    console.log(somaOcupacao, qtdPlat,  mediaOcupacao)

    if(mediaOcupacao <.5){
      this.setLigarBloqueio(4);
    }
    if(mediaOcupacao >.51){
      this.setLigarBloqueio(3);
    }
    if(mediaOcupacao >.7){
      this.setLigarBloqueio(2);
    }
    if(mediaOcupacao >.8){
      this.setLigarBloqueio(1);
    }

  }

//Funcoes

  private setLigarBloqueio(number: Number){
    
    for (let index = 0; index < this.Plataformas[0].LinhaBloqueio.length; index++) {
      this.Plataformas[0].LinhaBloqueio[index].Condicao = index < number? true:false;
    }
  }

  private getRandomPassageiro(count:number) {
    return ((Math.random() * count) / 100) * this.coefPassageiro;
  }

  private ShowDataRotina(){
    this.showData = this.dataAtual.getDay() + "/" + 
                    this.dataAtual.getMonth()  + "/" + 
                    this.dataAtual.getFullYear() + "  " + 
                    this.dataAtual.getHours() + ":" +
                    this.dataAtual.getMinutes() + ":" +
                    this.dataAtual.getSeconds();
    
  }

  private getQuantBloqueioLigado(plataformas :Plataforma[]){
    let variavel = 0;
    plataformas.forEach(lb => {
      let linhabloqueio = lb.LinhaBloqueio.length;
      if(linhabloqueio) {
        for (let index = 0; index < linhabloqueio; index++) {
           if(lb.LinhaBloqueio[index].Condicao) variavel++;
        }
      }
    });
    return variavel;
  }

  private setMinValue(val: number){
    return val <0?0:val;
  }

  private setMaxValue(val: number){
    return val >1?1:val;
  }

  public setCondicao(cond: Boolean){
    return cond ? "Ligado" : "Desligado";
  }

  public setCondicaoArrow(cond: number){
    return cond <.5 ? "Ligado" : "Desligado";
  }

  public setCondicaoArrowNorte(cond: Plataforma){
    const condicao = cond.ContagemNorte;
    
    if(condicao < .5)
      return "Ligado";
    
    if(cond.ContagemSul > condicao)
      return "Ligado";
    
    return "Desligado";
  }

  public setCondicaoArrowSul(cond: Plataforma){
    const condicao = cond.ContagemSul;
    
    if(condicao < .5)
      return "Ligado";
    
    if(cond.ContagemNorte > condicao)
      return "Ligado";
    
    return "Desligado";
  }

  public setPercentual(numero: number){
    let num = numero * 100;
    return num.toFixed(2);
  }
}
