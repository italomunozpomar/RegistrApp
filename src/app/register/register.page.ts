import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regForm: FormGroup;
  isShaking: boolean = false;

  sacudirItem() {
    this.isShaking = true;
    setTimeout(() => {
      this.isShaking = false;
    }, 400); // Desactiva la sacudida después de 0.4 segundos
  }

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    private toastCtrl: ToastController
  ) {
    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'),
        ],
      ],
      confirmPassword: ['', [Validators.required]], // Agregar campo para confirmar contraseña
    });
  }

  isFullnameValid(): boolean {
    const control = this.regForm.get('fullname');
    return !!control && control.touched && control.invalid;
  }

  isEmailValid(): boolean {
    const control = this.regForm.get('email');
    return !!control && control.touched && control.invalid;
  }

  isPasswordValid(): boolean {
    const control = this.regForm.get('password');
    return !!control && control.touched && control.invalid;
  }

  back(){
    this.router.navigate(['/login'])
  }

  ionViewWillLeave() {
    // Este código se ejecutará antes de que la página se elimine de la vista
    console.log("Saliendo de MyPage");
  }


  ngOnInit() {}

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm.valid) {
      // Verificar si las contraseñas coinciden
      const password = this.regForm.value.password;
      const confirmPassword = this.regForm.value.confirmPassword;

      if (password !== confirmPassword) {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Las contraseñas no coinciden.',
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        toast.present();
        return; // Detener el registro si las contraseñas no coinciden
      }

      try {
        const userCredential = await this.authService.registerUser(
          this.regForm.value.email,
          password // Utilizar la contraseña ingresada
        );

        if (userCredential && userCredential.user) {
          const fullName = this.regForm.value.fullname;
  
          // Configurar el nombre del usuario en Firebase
          await userCredential.user.updateProfile({
            displayName: fullName,
          });
  
          loading.dismiss();
  
          const toast = await this.toastCtrl.create({
            message: 'Registro exitoso',
            duration: 3000,
            position: 'top',
            color: 'success',
          });
          toast.present();
          this.router.navigate(['/login']);
        } else {
          loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'No se pudo registrar correctamente',
            duration: 3000,
            position: 'top',
            color: 'danger',
          });
          toast.present();
        }
      } catch (error) {
        loading.dismiss();
        console.error(error);
        // Manejo de errores
        // ...
      }
    } else {
      loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Por favor, completa todos los campos correctamente.',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
    }
  }
}
