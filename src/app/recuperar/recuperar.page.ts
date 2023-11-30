import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Animation, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../authentication.service';
@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})

export class RecuperarPage implements OnInit {
  user:any

  isShaking: boolean = false;

  activarSacudida() {
    this.isShaking = true;
    setTimeout(() => {
      this.isShaking = false;
    }, 1000); // Desactiva la sacudida después de 1 segundo
  }
  email: string = '';
  errorMensaje: string = '';

  constructor(
    private router:Router, 
    private animationCtrl:AnimationController,
    private toastController: ToastController,
    public authService: AuthenticationService,
    
    ) {}

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
  
  back(){
    this.router.navigate(['/login'])
  }

  ngOnInit() {
    this.animacionButton();
  }

  async resetPassword() {
    try {
      // Envía la solicitud de restablecimiento de contraseña
      await this.authService.resetPassword(this.email);

      // Muestra un mensaje de éxito
      const toast = await this.toastController.create({
        message: 'El enlace de restablecimiento de contraseña se ha enviado a tu correo electrónico.',
        duration: 5000, // Duración del mensaje en milisegundos
        position: 'top', // Posición del mensaje (top, bottom, middle)
        color: 'success', // Color del mensaje
      });

      await toast.present();

      // Redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);

    }
  }

  ionViewWillLeave() {
    // Este código se ejecutará antes de que la página se elimine de la vista
    console.log("Saliendo de MyPage");
  }



}

  

