import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/models/app-constants';
import { ErrorResponse } from 'src/app/models/error-response';
import { LoginRequest } from 'src/app/models/login-request';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { NotificationType } from 'src/app/models/notification.message';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { RequestCode } from 'src/app/models/requestCode';
import { AuthService } from 'src/app/services/auth/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';



@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('800ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AuthenticateComponent {
  isRemberMeChecked=false;
  visible:boolean = true;
  changetype:boolean = true;
  loginForm: FormGroup;

  //added this
  codeRequestForm: FormGroup;
  isSubmitting: boolean = false;
  email: string = '';
  submitDisabled: boolean = false;
  isLoginFailed = false;
  loginPage: boolean = true;
  token?: string;
  currentUser: any;

  @Output() emitData = new EventEmitter<LoginResponseData>();

  today = new Date();
  loginRequest: LoginRequest = {
    email: "",
    password: ""
  };

  //added this
  requestCode: RequestCode = {
    email: "",
  };

  

  loginResponseData: LoginResponseData | undefined;
  isLoggedIn = false;

  error: ErrorResponse = { error: '', errorCode: 0 };

  constructor(private fb: FormBuilder, private router: Router, private tokenService: TokenService,
              private notification: NotificationService, private userService: UserService, 
              private sharedService: SharedService, private toastr: ToastrService,
              private authService: AuthService
            ) 
  { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]], 
      password: ['', [Validators.required]],
      rememberMe:[]
    }); 
    
    //added this
    this.codeRequestForm = this.fb.group({
      email: ['', [Validators.required]]
    });

  }

  images: string[] = [
    'assets/images/auth/side_Image.png',
    'assets/images/auth/windmills-1850214_1280.jpg',
    'assets/images/auth/windmills-6626200_1280.jpg'
  ];
  
  quotes = [
    {
      title: 'Empowering Safety',
      message: 'Energy Isolation isn’t just protocol — it’s protection in progress.'
    },
    {
      title: 'Think First, Then Act',
      message: 'Lock out, tag out, verify — every time.'
    },
    {
      title: 'Zero Harm',
      message: 'Isolation saves lives. Let’s get home safe, every day.'
    }
  ];
  
  currentIndex = 0;
  
  get currentImage(): string {
    return this.images[this.currentIndex];
  }
  
  get currentQuote() {
    return this.quotes[this.currentIndex];
  }
  

  ngOnInit(){
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 7000); // change image & quote every 7 seconds
  } 

  async getinfo(){
    debugger
    
    const loginResponse: LoginResponseData = this.tokenService.getInfo();
    var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.router.navigate(['/home/dashboard']).then(() => {window.location.reload()});
      return true; 
    }
  


  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    let result = (Math.floor((new Date).getTime() / 1000)) >= expiry;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;

  }

      ngResetForm = this.fb.group({
        Code: ['', [Validators.required,]],
        });

      private domainCheck(email: string): boolean {
        if (email.endsWith('@lafarge.com') || email.endsWith('@holcim.com') || email.endsWith('@geocycle.com') || email.endsWith('@yopmail.com')) { return true }
        return false;
      }

      toggleForm() {
          this.submitDisabled = false;
          this.loginPage = !this.loginPage;
        }

        toggleFormBack() {
          this.loginPage = true;
          this.ngResetForm.get('Code')?.reset();
        }

      getCode() {
        debugger
        this.isSubmitting = true;
        const email = this.codeRequestForm.get('email');
        
        if (email){
          const username = email.value ? email.value.trim() : null;

          if (username !== null) {
            this.email = username;
          }
        }
      
        if(!this.domainCheck(this.email)){
          this.toastr.error("Email does not exist")
          this.isSubmitting = false;
          return;
        }   
        
        this.userService.requestLoginCode(this.email).subscribe(
          data => {
            debugger;
              if (data.requestSuccessful) {
                debugger;
                this.toggleForm();
                this.isSubmitting = false;
                this.toastr.success('Code request successful');
              } else {
                debugger;
                this.toastr.error(data.message);
                this.isSubmitting = false;
              }
            }, 
          
          error => {
           
            console.error('Error requesting login code', error);
            this.toastr.error(error.error.message);
            this.isSubmitting = false;
          }
        );
      }  
      
      

      verifyCode(): void {
        debugger
        this.isSubmitting = true;
         const codeControl = this.ngResetForm.get('Code');
         this.token = codeControl?.value as string;


         this.userService.validateLoginCode(this.token).subscribe(
          data => {
            debugger;
              if (data.requestSuccessful) {

              this.authService.saveSession(data.responseData);
              this.authService.setInfo(data.responseData);
                        this.isLoggedIn = true;
                        this.isLoginFailed = false;
              
                        this.getinfo();
                        this.isSubmitting = false;

                this.toastr.success('Code is valid');
              } else {
                debugger;
                this.toastr.error(data.message);
                this.isSubmitting = false;
              }
            }, 
          
          error => {
           
            console.error('Login Error', error);
            this.toastr.error(error.error.message);
            this.isSubmitting = false;
          }
        );
         
         
      }


}

