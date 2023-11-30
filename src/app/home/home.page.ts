import { Component, OnInit, OnDestroy } from '@angular/core';
import {  Router } from '@angular/router';
import { AnimationController, Animation, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../authentication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Plugins, } from '@capacitor/core';
import { Observable } from 'rxjs';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage implements OnInit, OnDestroy{
  data!: Observable<any>;


  nombreUsuario : string = "" 
  estadoAsistencia:string ="Ausente";
  user:any
  Asignatura : string =""
  Asistencia : string =""
  Fecha : string =""
  Docente : string=""
  estilo: any
  scannedResult: any;
  mensaje : string =""

  
  constructor
    ( 
    private afAuth:AngularFireAuth, 
    public authService:AuthenticationService, 
    private route:Router,
    private animationCtrl:AnimationController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    ){
    this.Asignatura = ""; // Valor predeterminado o cualquier valor inicial que desees
    this.actualizarDocente(); // Llama a la función para establecer el docente inicial
    this.user = authService.getProfile
  }


  async logout(){
    this.authService.singOut().then(()=>{
      console.log("te has deslogeado")
      this.route.navigate(['/login'])
    }).catch((error)=>{
      console.log(error);

    })
  }

  async pedirPermiso() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
  
      if (status.granted) {
        return true;
      } else if (!status.asked) {
        // El permiso aún no se ha solicitado, solicitarlo
        const result = await BarcodeScanner.checkPermission({ force: true });
        return result.granted;
      } else {
        // El permiso ha sido denegado o no se puede solicitar
        // Invitar al usuario a abrir la configuración de la aplicación
        await BarcodeScanner.openAppSettings();
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  
  apagarCamara() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  
    const bodyElement = document.querySelector('body');
  
    if (bodyElement) {
      bodyElement.classList.remove('scanner-active');
    } else {
      console.error("No se encontró el elemento body");
    }
  }


  async abrirCam() {
    try {
      const permission = await this.pedirPermiso();
      if (!permission) {
        return;
      }
  
      const { Toast } = Plugins;
  
      // Mostrar un mensaje antes de abrir la cámara
      await Toast['show']({
        text: 'Abriendo la cámara...',
        duration: 'short'
      });
  
      const bodyElement = document.querySelector('body');
      const qrCodeFrame = document.getElementById('qrCodeFrame');
      const qrMessage = document.getElementById('qrMessage');
  
      if (!bodyElement || !qrCodeFrame || !qrMessage) {
        console.error("Elementos no encontrados");
        return;
      }
  
      bodyElement.classList.add('scanner-active');
      qrCodeFrame.style.display = 'block'; // Muestra el cuadro
      qrMessage.style.display = 'block'; // Muestra el mensaje
      await BarcodeScanner.hideBackground();
      this.estilo = 'hidden';
  
      const result = await BarcodeScanner.startScan();
      console.log(result);
  
      BarcodeScanner.showBackground();
      bodyElement.classList.remove('scanner-active');
  
      qrCodeFrame.style.display = 'none'; // Oculta el cuadro
      qrMessage.style.display = 'none'; // Oculta el mensaje
      this.estilo = '';
  
      if (result?.hasContent) {
        const codigoQr = result.content;
  
        if (this.validarCodigoQr(codigoQr)) {
          this.Asignatura = codigoQr; // Asignar el valor del código QR a Asignatura
          this.actualizarDocente(); // Actualizar el docente según la nueva asignatura
          this.estadoAsistencia = 'Presente';
          await Toast['show']({
            text: 'QR escaneado con éxito!',
            duration: 'short'
          });
        } else {
          await Toast['show']({
            text: 'QR no válido...',
            duration: 'short'
          });
          this.apagarCamara();
        }
      }
    } catch (e) {
      console.log(e);
      this.apagarCamara();
    }
  }
  
  

  obtenerFecha(): string {
    const fechaActual = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',};
    return fechaActual.toLocaleDateString('es-ES', options);
  }

  
  obtenerHora(): string {
    const HoraActual = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return HoraActual.toLocaleTimeString('es-ES', options);
  }

  actualizarDocente() {
    if (this.Asignatura === "PGY4121_006D") {
      this.Docente = "Patricio 'Huachipato' Hernández";
    } else if (this.Asignatura === "ASY4131_005D") {
      this.Docente = "Señor Cesar";
    } else {
      this.Docente = "";
    }
  }

  redirectToCargarApiPage() {
    this.route.navigate(['/api']);
  }

  validarCodigoQr(codigoQr: string): boolean {
    // Agrega aquí las lógicas de validación según tus necesidades
    // En este ejemplo, se compara el código QR con los valores permitidos
    return codigoQr === "PGY4121_006D" || codigoQr === "ASY4131_005D";
  }

 
  /*
  async tomarFoto() {
    try {
      const { Camera, Toast } = Plugins;
  
      // Mostrar un mensaje antes de abrir la cámara
      await Toast['show']({
        text: 'Abriendo la cámara...',
        duration: 'short'
      });
  
      this.estadoAsistencia = 'Presente';
      const image = await Camera['getPhoto']({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      await Toast['show']({
        text: 'Qr escaneado con éxito',
        duration: 'short'
      });
    } catch (error) {
      console.error('Error al tomar foto:', error);
    }
  }
  */


  async animacionEvento(){
    const animation:Animation = this.animationCtrl.create()
    .addElement(document.querySelectorAll('.titulo'))
    .duration(2500)
    .iterations(1)
    .keyframes([
      { offset: 0, transform: 'scale(0.8)', opacity:'0.2' },
      { offset: 0.5, transform: 'scale(1)', opacity:'1' },
    ]);
    await animation.play();

  }

  ionViewWillLeave() {
    // Este código se ejecutará antes de que la página se elimine de la vista
    console.log("Saliendo de MyPage");
  }



  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if(user){
        this.nombreUsuario= user.displayName || 'Usuario';
      }
    })
    this.animacionEvento();
  }

  AgregarDatos() {
    const data = {
    asignatura: this.Asignatura,
    asistencia: this.estadoAsistencia,
    fecha: this.obtenerFecha(), // Llama a la función para obtener la fecha
    nombre: this.nombreUsuario,
  };
    this.firestore.collection('asistencia').add(data)
    .then((docRef) => {
      console.log('Documento agregado con ID: ', docRef.id);
      console.log('nombreUsuario:', this.nombreUsuario);
      console.log('Asignatura:', this.Asignatura);
      console.log('estadoAsistencia:', this.estadoAsistencia);
      this.mostrarMensajeConfirmacion();
      // Vaciar el parámetro de "Asignatura" después de agregar los datos
      this.Asignatura = ''; // Asigna un valor vacío
      this.Docente = '';
      this.estadoAsistencia = 'Ausente'
    })
      .catch((error) => {
        console.error('Error al agregar el documento:', error);
      });
}
async mostrarMensajeConfirmacion() {
  const toast = await this.toastController.create({
    message: 'Su asistencia quedo registrada correctamente',
    duration: 2000, // Duración en milisegundos
    position: 'bottom', // Puedes cambiar la posición si lo deseas
    color: 'success' // Puedes cambiar el color
  });
  toast.present();
}

ngOnDestroy(): void {
  this.apagarCamara();
}

}

