import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Usuario} from "../../models/Usuario.model";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  inputValue: string = '';
  //usuarioLogado: Usuario = new Usuario();
  usuarios: Usuario[] = [
    new Usuario(1,'gerente 1','usuario1@email.com'),
    new Usuario(2,'Gerente 2','usuario2@email.com'),
    new Usuario(3,'Gerente 3','usuario3@email.com'),
  ];
  buttonOne: string = "Detalhes";




  constructor(
    // private title: TitleService,
    // private userService: UsuarioService,
    private cdr: ChangeDetectorRef,
    // private toastr: ToastrService,
    private router: Router,
    // public loginService: LoginService
  ) { }
  ngOnInit(): void {
    // this.title.setTitle('Listar Usuários');
    // this.usuarioLogado = this.loginService.usuarioLogado
    // if (!this.usuarioLogado) {
    //   this.router.navigate(['login']);
    // } else {
    //   // this.instanciarUsuarios();
    // }

  }
  @ViewChild('table') table: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<Usuario>;
  obs!: Observable<Usuario[]>;
  // instanciarUsuarios() {
  //   this.userService.listarTodosUsuarios().subscribe(
  //     (usuarios) => {
  //       this.usuarios = usuarios;
  //       this.dataSource = new MatTableDataSource(this.usuarios);
  //       this.dataSource.paginator = this.paginator;
  //       this.cdr.detectChanges();
  //       this.obs = this.dataSource.connect();
  //       this.toastr.success('Usuários listados com sucesso!');
  //     },
  //     (error) => {
  //       this.toastr.error('Erro ao listar usuários!');
  //     }
  //   );
  //   if (this.table) {
  //     this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  //     this.dataSource.paginator = this.paginator;
  //     this.cdr.detectChanges();
  //     this.obs = this.dataSource.connect();
  //   }
  // }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  applyFilter(event: Event) {
    if (this.dataSource) {
      this.inputValue = (event.target as HTMLInputElement).value;
      const filterValue = this.inputValue.trim().toLowerCase();
      this.dataSource.filter = filterValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }
  openDialog(usuario: Usuario) {
    this.router.navigate([`admin/editar/${usuario.id}`]);
  }

}