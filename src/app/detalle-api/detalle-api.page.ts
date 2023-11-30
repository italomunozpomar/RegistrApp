import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ApiService } from '../api.service';



@Component({
  selector: 'app-detalle-api',
  templateUrl: './detalle-api.page.html',
  styleUrls: ['./detalle-api.page.scss'],
})
export class DetalleApiPage implements OnInit {
  characters: any[] = [];
  nombreUsuario : string = "" 
  user: any;
  charactersId: number | undefined;
  character: any; // Agrega la propiedad 'character' aquí

  constructor(
    private afAuth:AngularFireAuth, 
    public authService:AuthenticationService,  
    private router:Router, 
    private apiService: ApiService,
    private route:ActivatedRoute,

  ) { 
    this.user = authService.getProfile 
    this.route.params.subscribe((params) => {
      this.charactersId = +params['id']; // Asigna el valor del ID de la URL
    });
  }

  back(){
    this.router.navigate(['/api'])
  }

  ionViewWillLeave() {
    // Este código se ejecutará antes de que la página se elimine de la vista
    console.log("Saliendo de MyPage");
  }


  async logout(){
    this.authService.singOut().then(()=>{
      console.log("te has deslogeado")
      this.router.navigate(['/login'])
    }).catch((error)=>{
      console.log(error);

    })
  }

  ngOnInit(): void {

    this.apiService.getCharacters().subscribe((data) => {
      this.characters = data.results;
      const character = this.characters.find(char => char.id === this.charactersId);

      if (character) {
        this.character = character;
      }

      console.log("Cargó");
    });

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.nombreUsuario = user.displayName || 'Usuario';
      }
    });
  }


}
