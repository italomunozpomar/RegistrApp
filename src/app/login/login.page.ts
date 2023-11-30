import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Animation, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm : FormGroup

  isShaking: boolean = false;

  sacudirItem() {
    this.isShaking = true;
    setTimeout(() => {
      this.isShaking = false;
    }, 400); // Desactiva la sacudida después de 0.4 segundos
  }
  
  errorMensaje="";
  contador= 0;
  constructor(private router:Router, 
    private animationCtrl:AnimationController,
    private formBuilder:FormBuilder, 
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public authService:AuthenticationService
     ) { 
      this.loginForm = this.formBuilder.group({
        email :['', [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
        ]],
      password:['',[
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]]
  
      })

    }
    isEmailValid(): boolean {
      const control = this.loginForm.get('email');
      return !!control && control.touched && control.invalid;
    }
    isPasswordValid(): boolean {
      const control = this.loginForm.get('password');
      return !!control && control.touched && control.invalid;
    }
  async animacionButton(){
    const animation:Animation = this.animationCtrl.create()
    .addElement(document.querySelectorAll('#animated-button'))
    .duration(1500)
    .iterations(Infinity)
    .keyframes([
      { offset: 0, transform: 'scale(1)'},
      { offset: 0.5, transform: 'scale(1.2)'},
      { offset: 1, transform: 'scale(1)'}
    ]);
    await animation.play();

  }

  ionViewWillLeave() {
    // Este código se ejecutará antes de que la página se elimine de la vista
    console.log("Saliendo de MyPage");
  }


  ngOnInit() {
    this.animacionButton();
    
  }
  get errorControl(){
    return this.loginForm?.controls;
  }

  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
  
    if (this.loginForm.valid) {
      try {
        const userCredential = await this.authService.loginUser(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
  
        if (userCredential && userCredential.user) {
          // Obtener el nombre del usuario si está disponible en Firebase
          const user = userCredential.user;
  
          loading.dismiss();
  
          // Mostrar un mensaje de bienvenida con el nombre del usuario
          const toast = await this.toastCtrl.create({
            message: '¡Bienvenido, ' + user.displayName + '!', // Mostrar el nombre del usuario si está disponible
            duration: 3000,
            position: 'top',
            color: 'success',
          });
          toast.present();
  
          this.router.navigate(['/home']);
        } else {
          loading.dismiss();
          
        }
      } catch (error) {
        if (error instanceof Error) {
          // Comprobación de tipo
          loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Error al iniciar sesión: ' + error.message,
            duration: 3000,
            position: 'top',
            color: 'danger',
          });
          toast.present();
          this.sacudirItem();
        } else {
          // Manejo de errores desconocidos
          console.error('Error desconocido:', error);
        }
      }
    }
  }
}

