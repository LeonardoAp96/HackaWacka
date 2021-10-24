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

  private NIVEL_WARNING : number = .7;
  private NIVEL_DANGER : number = .9;
  private dataAtual: Date;
  private countSimultationTime: number;
  private countSimultationFilaTime: number;
  private countTime = 0;

  public filaBloqueio:number;
  public coefFila: number;
  public linhaBloqueio: Bloqueio[];
  public Plataformas: Plataforma[];
  public showData: String;
  public coefPassageiro: number;
  public headwayPlataforma:number;
  public tempoIntervalo : number = 3; //segundos
  public noTrem: Boolean;
  public modoManual: Boolean;


  constructor() {
    this.dataAtual = new Date();  
    this.coefPassageiro = 2;
    this.coefFila = 2;
    this.headwayPlataforma = 10;
    this.countSimultationTime = 0;
    this.countSimultationFilaTime = 0;
    this.filaBloqueio = 0.1;
    this.ShowDataRotina();
    this.montarPlataforma();
  }  
  
  routine = setInterval(()=>this.rotina(), 1000);

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
      }
    ];
  }
  
  private rotina(){
    this.countTime++;
    if(this.countTime%this.tempoIntervalo == 0){
     this.dataAtual = new Date();
     this.ShowDataRotina();
     this.Simulação();
     this.SimulacaoFila();
     this.countSimultationTime += 1;
     this.countSimultationFilaTime += 1;
    }
  }

  private Simulação(){ //Demostração de dados colhidos pela cameraxbloqueio
    let countBloqueio = 0;
    let percentualPasgPlatNorte = 0;
    let percentualPasgPlatSul = 0;


    if(this.countSimultationTime>=this.headwayPlataforma && !this.noTrem){ //Passagem do trem
      for(let count = 0; count < this.Plataformas.length; count++){
        percentualPasgPlatNorte = this.Plataformas[count].ContagemNorte *0.1;
        percentualPasgPlatSul = this.Plataformas[count].ContagemNorte *0.1;
        
        this.Plataformas[count].ContagemNorte = this.setMinValue(percentualPasgPlatNorte);
        this.Plataformas[count].ContagemSul = this.setMinValue(percentualPasgPlatSul);
      }

      this.countSimultationTime=0;
    }
    else { //Entrada de passageiros
      countBloqueio = this.getQuantBloqueioLigado(this.Plataformas);

      for(let count = 0; count < this.Plataformas.length; count++){
        percentualPasgPlatNorte = this.Plataformas[count].ContagemNorte + this.getRandomPassageiro(countBloqueio);
        percentualPasgPlatSul = this.Plataformas[count].ContagemSul + this.getRandomPassageiro(countBloqueio);
        
        this.Plataformas[count].ContagemNorte = this.setMaxValue(percentualPasgPlatNorte);
        this.Plataformas[count].ContagemSul =  this.setMaxValue(percentualPasgPlatSul);
      };
      
    };


    this.AlgoritmoBloqueios();
  }

  private SimulacaoFila(){
    let countBloqueio = this.getQuantBloqueioLigado(this.Plataformas);
    let TotalBloqueio = this.Plataformas[0].LinhaBloqueio.length;

    let percentualFila = this.setMinValue(this.filaBloqueio + this.getRandomFila(countBloqueio, TotalBloqueio));

    if(this.countSimultationFilaTime>=this.headwayPlataforma && !this.noTrem){ 
      if(this.filaBloqueio >0.7){this.filaBloqueio *= 0.5;}
      else{this.filaBloqueio *= 0.2;}
      this.countSimultationFilaTime=0;
    }else{
      if(countBloqueio >= (TotalBloqueio/2))
        this.filaBloqueio -= this.getRandomFila(countBloqueio,TotalBloqueio);

      this.filaBloqueio = this.setMaxValue(percentualFila);
    }
  
  }

  private AlgoritmoBloqueios(){
    let somaOcupacao = 0;
    let qtdPlat = 0;

    this.Plataformas.forEach(pl=>{
      somaOcupacao += (pl.ContagemNorte + pl.ContagemNorte)/2;
      qtdPlat++;
    });

    
    const mediaOcupacao = somaOcupacao / qtdPlat;

    if(!this.modoManual){
      if(mediaOcupacao <.5){
        this.setLigarBloqueio(4);
        
        if(this.filaBloqueio>0.5)
          this.setLigarBloqueio(5);
        
        if(this.filaBloqueio>0.7)
          this.setLigarBloqueio(6);

        if(this.filaBloqueio>0.75)
          this.setLigarBloqueio(6);

        if(this.filaBloqueio>0.8)
          this.setLigarBloqueio(8);
        
      }
      if(mediaOcupacao >=.5){
        this.setLigarBloqueio(3);
      }
      if(mediaOcupacao >.7){
        this.setLigarBloqueio(2);
      }
      if(mediaOcupacao >.8){
        this.setLigarBloqueio(1);
      }
      if(mediaOcupacao >.9){
        this.setLigarBloqueio(0);
      }
    }
  }


//Funcoes
  public tremNaPlataforma(){
    this.countSimultationTime = this.headwayPlataforma;
    this.noTrem = false;
  }

  public toggleBloqueio(LinhaB:Plataforma, index:number){
    if(!this.modoManual) return;
    let val = !LinhaB.LinhaBloqueio[index].Condicao;
    this.Plataformas[0].LinhaBloqueio[index].Condicao = val;
  }
  
  private setLigarBloqueio(number: Number){
    
    for (let index = 0; index < this.Plataformas[0].LinhaBloqueio.length; index++) {
      this.Plataformas[0].LinhaBloqueio[index].Condicao = index < number? true:false;
    }
  }

  private getRandomPassageiro(count:number) {
    return ((Math.random() * count) / 100) * this.coefPassageiro;
  }

  private getRandomFila(count:number, total:number) {
    return ((Math.random() * (count)) / 100) * this.coefFila;
  }

  public SetFilaBloqueio(num){
    this.filaBloqueio = num;
  }

  public ShowDataRotina(){
    this.showData = this.setZeroData(this.dataAtual.getDate()) + "/" + 
                    this.setZeroData((this.dataAtual.getMonth()+1))  + "/" + 
                    this.dataAtual.getFullYear() + "  " + 
                    this.setZeroData(this.dataAtual.getHours()) + ":" +
                    this.setZeroData(this.dataAtual.getMinutes()) + ":" +
                    this.dataAtual.getSeconds();
    
    return this.showData + " - ciclo:" + this.countSimultationTime + " de " + this.headwayPlataforma; 
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

  public setCondicaoBloqueio(cond: Boolean){
    return cond ? "Ligado" : "Desligado";
  }

  public setCondicaoProgressBar(cond: number){

    if(cond >= this.NIVEL_DANGER)
    return "danger"

    if(cond >= this.NIVEL_WARNING)
      return "warning"
      
    return "secondary";
  }

 
  public setCondicaoArrowNorte(cond: Plataforma){
    const condicao = cond.ContagemNorte;
    
    if(condicao < .5)
      return "Ligado";

      if(condicao > .9)
        return "Desligado";
    
    if(cond.ContagemSul > condicao)
      return "Ligado";
    
    return "Desligado";
  }

  public setCondicaoArrowSul(cond: Plataforma){
    const condicao = cond.ContagemSul;
    
    if(condicao < .5)
      return "Ligado";

    if(condicao > .9)
      return "Desligado";
    
    if(cond.ContagemNorte > condicao)
      return "Ligado";
    
    return "Desligado";
  }

  public setZeroData(numero: number){
    return numero<=0? "0"+numero:numero;
  }

  public setPercentual(numero: number){
    let num = numero * 100;
    return num.toFixed(2).toString()+"%";
  }
}
