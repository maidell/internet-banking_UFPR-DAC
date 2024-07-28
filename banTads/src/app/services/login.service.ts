import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Usuario} from "../models/Usuario.model";
import { Login} from "../models/login.model";
import { ApiResponseLogin } from "../interfaces/api-response-login";
import { CookieService } from 'ngx-cookie-service';

const COOKIE_USUARIO: string = 'usuarioLogado';
const COOKIE_TOKEN: string = 'x-access-token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  BASE_URL = "http://localhost:8085";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }; 

  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  public get usuarioLogado(): Usuario | null {
    const usu = this.cookieService.get(COOKIE_USUARIO);
    console.log('usu', usu);
    return usu ? JSON.parse(usu) : null;

  }

  public set usuarioLogado(usuario: Usuario | null) {
    console.log('usuario', usuario);
    console.trace();
    if (usuario) {

      this.cookieService.set(COOKIE_USUARIO, JSON.stringify(usuario));
    } else {
      this.cookieService.delete(COOKIE_USUARIO);
    }
  }

  public getToken(): string | null {
    return this.cookieService.get(COOKIE_TOKEN);
  }

  logout() {
    this.usuarioLogadoSubject.next(null);
    this.cookieService.delete(COOKIE_USUARIO);
    this.cookieService.delete(COOKIE_TOKEN);
    this.httpClient.post<ApiResponseLogin>(this.BASE_URL + '/logout', {}, this.httpOptions).subscribe();
    window.location.reload();
  }

  login(login: Login): Observable<Usuario> {
    return this.httpClient.post<ApiResponseLogin>(this.BASE_URL + '/api/auth/login', JSON.stringify(login), this.httpOptions)
      .pipe(
        map(response => {
          const usuario = response.data;
          const token = response.message;
          if (usuario && token) {
            this.usuarioLogado = usuario;
            this.cookieService.set(COOKIE_TOKEN, token);
            this.usuarioLogadoSubject.next(usuario);
          }
          return usuario;
        })
      );
  }

  validarSenha(login: Login): Observable<boolean> {
    return this.httpClient.post<boolean>(this.BASE_URL + '/authPassword', JSON.stringify(login), this.httpOptions);
  }
}