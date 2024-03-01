import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL_GSB_LISTAR_NAVEGACION } from '../config';
import { API_URL_BUSCAR_AMENAZA } from '../config';
import { API_URL_IPINFO } from '../config';
import { API_URL_VT_CONSULTAR_ARCHIVOS_IP } from '../config';
import { API_URL_VT_CONSULTAR_IP } from '../config';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface LastAnalysisResult {
  engine_name: string;
  result: string;
}

@Component({
  selector: 'app-homeauth',
  templateUrl: './homeauth.component.html',
  styleUrls: ['./homeauth.component.css']
})
export class HomeauthComponent {
  url: string = '';
  response: any = {};
  threatLists: any;
  ipInput: string = '';
  ipInfo: any;

  ipInputVT: string = '';
  ipInfoVT: any;
  urlRegex: RegExp = /^(?:(?:https?|sdp|ftp(?:s)?|ssh):\/\/)?(?:www\.)?[^\s/$.?#].[^\s]*$/;

  ipv4Pattern: string = '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
  fileToUpload: File | null = null;

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) { }



  //1 LISTO consulta de lista de amenazas
  listadoNavegacion() {
    this.spinner.show();
    this.http.get<any>(API_URL_GSB_LISTAR_NAVEGACION).subscribe(
      response => {
        this.spinner.hide();
        this.toastr.success('Consulta realizada correctamente.', 'Éxito.');

        this.threatLists = response.threatLists;
      },
      error => {
        this.spinner.hide();
        this.toastr.info('Estamos teniendo problemas técnicos. Por favor, intenta nuevamente en unos minutos.', 'Oops.');
      }
    );
  }
  //2 LISTO escanea amenazas con google safe browsing
  escanearAmenazas() {
    if (!this.urlRegex.test(this.url)) {
      this.toastr.info('Debes ingresar valores tipo url.', 'Datos incompletos.');
      return;
    }
    const body = { url: this.url };
    this.spinner.show();
    this.http.post(API_URL_BUSCAR_AMENAZA, body)
      .subscribe(
        (data: any) => {
          this.spinner.hide();
          this.toastr.success('Consulta realizada correctamente.', 'Éxito.');
          this.response = data;
        },
        error => {
          this.spinner.hide();
          this.toastr.info('Estamos teniendo problemas técnicos. Por favor, intenta nuevamente en unos minutos.', 'Oops.');
        }
      );
  }
  //3 listo verifica IP con ipinfo
  verificarIP() {
    if (!this.ipInput.match(this.ipv4Pattern)) {
      this.toastr.info('Dirección IPv4 no válida.', 'Datos incorrectos.');
      return;
    }
    this.spinner.show();
    this.http.post<any>(API_URL_IPINFO, { ip: this.ipInput })
      .subscribe(
        response => {
          this.spinner.hide();
          this.toastr.success('Consulta realizada correctamente.', 'Éxito.');
          this.ipInfo = response;
        },
        error => {
          this.spinner.hide();
          this.toastr.info('Estamos teniendo problemas técnicos. Por favor, intenta nuevamente en unos minutos.', 'Oops.');
        }
      );
  }

  getLastAnalysisResults(results: any): string[] {
    return Object.keys(results);
  }
  //validar IPsv4
  verificarIP_VT() {
    if (!this.ipInputVT.match(this.ipv4Pattern)) {
      this.toastr.info('Dirección IPv4 no válida.', 'Datos incorrectos.');
      return;
    }
    const body = { ip: this.ipInputVT };
    this.spinner.show();
    this.http.post(API_URL_VT_CONSULTAR_IP, body).subscribe(
      (response) => {
        this.spinner.hide();
        this.toastr.success('Consulta realizada correctamente.', 'Éxito.');
        this.ipInfoVT = response;
      },
      (error) => {
        this.spinner.hide();
        this.toastr.info('Estamos teniendo problemas técnicos. Por favor, intenta nuevamente en unos minutos.', 'Oops.');
        console.error('Error al consultar la IP:', error);
      }
    );
  }

  convertUnixTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  getLastAnalysisResult(results: any): string {
    const lastResult: LastAnalysisResult = Object.values(results).pop() as LastAnalysisResult;
    return `${lastResult.engine_name}: ${lastResult.result}`;
  }

  //genera texto de prueba
  generateTxtFile() {
    const content = `209.99.40.219
78.138.126.220
78.138.126.223`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo_de_prueba.txt';
    a.click();
    window.URL.revokeObjectURL(url);

  }



  //validacion de seleccion de archivo
  onFileSelected(event: any) {
    this.fileToUpload = event.target.files[0];
    if (!this.fileToUpload || !this.fileToUpload.name.endsWith('.txt')) {
      alert('Por favor, seleccione un archivo .txt válido.');
      this.fileToUpload = null;
    }
  }
  //procesar archivo cargado para consulta de IPs
  processFile() {
    if (!this.fileToUpload) {
      this.toastr.info('Por favor, seleccione un archivo.', 'Oops.');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.spinner.show();
    this.http.post(API_URL_VT_CONSULTAR_ARCHIVOS_IP, formData, { responseType: 'text' })
      .subscribe(
        response => {
          this.spinner.hide();
          console.log('El archivo se ha enviado correctamente al servidor.' + response);
          const blob = new Blob([response], { type: 'text/csv' });
          saveAs(blob, 'resultados.csv');
          this.toastr.success('Procesamiento realizado correctamente.', 'Éxito.');
        },
        error => {
          this.spinner.hide();
          this.toastr.info('Estamos teniendo problemas técnicos. Por favor, intenta nuevamente en unos minutos.', 'Oops.');

        }
      );
  }
  
  goToLoginPage() {
    this.router.navigateByUrl('/');
  }

}
