import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
 cotacaoAtual: any = null;
  cotacaoPorPeriodoLista: Cotacao[] = [];
  showErrorAlert = false;
  backgroundImage = 'url(./assets/images/back5.png)';
  apenasCotacoesMenores = false;

  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe
  ) {}

  ngOnInit() {
    this.cotacaoDolarService.getCotacaoAtual().subscribe(
      (cotacoes: any[]) => {

        if (cotacoes && cotacoes.length > 0 && cotacoes[0].preco) {
          this.cotacaoAtual = cotacoes[0].preco;
        } else {
          console.error('A resposta do serviço não contém a propriedade "preco".');
        }
      },
      (error) => {
        console.error('Erro ao obter a cotação atual:', error);
      }
    );
  }

  public getCotacaoPorPeriodo(
    dataInicialString: string,
    dataFinalString: string
  ): void {
    this.cotacaoPorPeriodoLista = [];

    const dataInicial = this.dateFormat.transform(dataInicialString, 'MM-dd-yyyy') || '';
    const dataFinal = this.dateFormat.transform(dataFinalString, 'MM-dd-yyyy') || '';

    if (this.apenasCotacoesMenores) {
      this.getCotacaoMenorAtual(dataInicial, dataFinal);
    } else {
      if (dataInicial && dataFinal && this.compararDatas(dataInicial, dataFinal) && this.validarDataAtual(dataInicial, dataFinal)) {
        this.showErrorAlert = false;
        this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal).subscribe(cotacoes => {
          this.cotacaoPorPeriodoLista = cotacoes;
        });
      } else {
        this.showErrorAlert = true;
      }
    }
  }

  public getCotacaoMenorAtual(dataInicial: string, dataFinal: string): void {
      this.cotacaoDolarService.getCotacaoMenorAtual(dataInicial, dataFinal).subscribe(cotacoes => {
       this.cotacaoPorPeriodoLista = cotacoes;
     });
  }

  private compararDatas(dataInicial: string, dataFinal: string): boolean {
    const dateInicial = new Date(dataInicial);
    const dateFinal = new Date(dataFinal);

    return dateInicial <= dateFinal;
  }

  private validarDataAtual(dataInicial: string, dataFinal: string): boolean {
    const dataAtual = new Date();
    const dateInicial = new Date(dataInicial);
    const dateFinal = new Date(dataFinal);

    return dateInicial <= dataAtual && dateFinal <= dataAtual;
  }


}
