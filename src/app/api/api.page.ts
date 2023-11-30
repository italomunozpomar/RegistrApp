import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ApiService } from '../api.service';



@Component({
  selector: 'app-api',
  templateUrl: './api.page.html',
  styleUrls: ['./api.page.scss'],
})
export class APIPage implements OnInit {
  characters: any[] = [];
  nombreUsuario : string = "" 
  user: any;

  constructor(
    private afAuth:AngularFireAuth, 
    public authService:AuthenticationService,  
    private route:Router, 
    private apiService: ApiService,
    ) { 

    this.user = authService.getProfile 
  }

  back(){
    this.route.navigate(['/home'])
  }

  verDetalles(characterId: number) {
    // Redirigir a la página de detalles y pasar el ID como parámetro
    this.route.navigate(['/detalle-api', characterId]);
  }

  async logout(){
    this.authService.singOut().then(()=>{
      console.log("te has deslogeado")
      this.route.navigate(['/login'])
    }).catch((error)=>{
      console.log(error);

    })
  }

  ionViewWillLeave() {
    // Este código se ejecutará antes de que la página se elimine de la vista
    console.log("Saliendo de MyPage");
  }


  ngOnInit(): void {
    this.apiService.getCharacters().subscribe((data) => {
      this.characters = data.results;
      console.log("Cargó")
    });

    this.afAuth.authState.subscribe(user => {
      if(user){
        this.nombreUsuario= user.displayName || 'Usuario';
      }
    })
    

  }

}
