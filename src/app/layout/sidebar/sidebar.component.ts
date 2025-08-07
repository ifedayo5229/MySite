import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';
import { LoginResponseData } from 'src/app/models/login-response-data';

interface MenuItem {
  label: string;
  image: string;
  route?: string; 
  subMenu?: MenuItem[]; 
  roles: string[];
  isSubMenuOpen?: boolean; 
}

interface SingleMenu {
  label: string;
  image: string;
  route: string;  
  roles: string[];  
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isSidebarVisible$: Observable<boolean>;
  isSidebarOpen$ = this.sidebarService.sidebarOpen$;
  activeItem: any = null;
  filteredMenuItems: MenuItem[] = [];
  filteredSingleMenu: SingleMenu[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private sidebarService: SidebarService,
    private router: Router,
    private tokenService: TokenService
  ) 
  {
    const isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));

    this.isSidebarVisible$ = combineLatest([isHandset$, this.sidebarService.sidebarOpen$]).pipe(
      map(([isHandset, isOpen]) => !isHandset || isOpen)
    );
  } 


  ngOnInit(){
    this.getinfo();
    this.updateFilteredMenuItems();
    this.updateFilteredSingleMenu();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  isOpen = false ;
  currentUser: any;
  firstName: any;
  lastName: any;
  fullname: any;
  userRoles: string[] = []; 

  getinfo(){
    debugger
    
    const loginResponse: LoginResponseData = this.tokenService.getInfo();
    var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      var roles = this.currentUser.roles;
      const userRoles = roles.map((role: { roleName: any; }) => role.roleName);
      if (userRoles.length == 0)
      {
        userRoles.push('Requester');
      }
      this.userRoles = userRoles;
      
    }

  // Menu items with roles
  // Possible roles: "Store Manager", "Admin", "Requester", "Store Approver", "Line Manager"
  menuItems: MenuItem[] = [
    // {
    //   label: 'Dashboard',
    //   image: 'assets/images/icons/SVGs/set_route.svg',
    //   roles: ['Admin','Store Manager', 'Requester', 'Store Approver', 'Line Manager'],
    //   isSubMenuOpen: false, 
    // },
    {
      label: 'Application',
      image: 'assets/images/icons/SVGs/set_route.svg',
      roles: ['System Admin', 'Requester'],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'Create App Request',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['System Admin', 'Requester'],
          route: '/home/create-application-request',

        },
        {
          label: 'App Request(s)',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['System Admin', 'Requester'],
          route: '/home/my-permits',
        },
        {
          label: 'All App Requests',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['System Admin', 'Permit Issuer', 'Isolator'],
          route: '/home/all-permits',
        },
      ],
    },

    {
      label: 'Approval',
      image: 'assets/images/icons/SVGs/view_items.svg',
      roles: ['System Admin', 'Permit Issuer', 'Isolator'],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'Pending Request(s)',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['System Admin', 'Permit Issuer', 'Isolator'],
          route: '/home/pending-permits',
        },
      ],
    },

    {
      label: 'IT Space',
      image: 'assets/images/icons/SVGs/view_report.svg',
      roles: ['System Admin'],
      isSubMenuOpen: false, 
      subMenu: [
        {
          label: 'All App Request(s)',
          image: 'assets/images/icons/SVGs/request_for_items.svg',
          roles: ['System Admin'],
          route: '/home/pending-closure',

        },
       
      ],
    },

    {
      label: 'Audit Trail',
      image: 'assets/images/icons/SVGs/view_report.svg',
      roles: ['System Admin', 'Permit Issuer'],
      isSubMenuOpen: false,
      subMenu: []
    },

    {
      label: 'Roles and Permissions',
      image: 'assets/images/icons/SVGs/view_report.svg',
      roles: ['System Admin'],
      isSubMenuOpen: false,
      subMenu: [
        {
          label: 'View Users',
          image: 'assets/images/icons/SVGs/view_report.svg',
          roles: ['System Admin'],
          route: '/home/view-users',
        }
      ]
    },

  ];

  singleMenu: SingleMenu[] = [
    {
      label: 'Dashboard',
      image: 'assets/images/icons/SVGs/dashboard.png',
      route: '/home/dashboard', 
      roles: ['System Admin']   
    }   
  ];


  updateFilteredMenuItems(): void {
    this.filteredMenuItems = this.menuItems
      .filter(menu => menu.roles.some(role => this.userRoles.includes(role)))
      .map(menu => ({
        ...menu,
        subMenu: Array.isArray(menu.subMenu)
          ? menu.subMenu.filter(sub =>
              sub.roles.some(role => this.userRoles.includes(role))
            )
          : [],
      }));
  }

  updateFilteredSingleMenu(): void {
    this.filteredSingleMenu = this.singleMenu
      .filter(menu => menu.roles.some(role => this.userRoles.includes(role)));
}
  

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  toggleSubMenu(menuItem: MenuItem): void {
    menuItem.isSubMenuOpen = !menuItem.isSubMenuOpen;
  }
  

  onSubMenuItemClick(subItem: MenuItem) {
    this.activeItem = subItem;
    console.log(`Routing to: ${subItem.route}`);
    this.router.navigate([subItem.route]);
    
    // Collapse all submenus
    this.menuItems.forEach(item => (item.isSubMenuOpen = false));
    this.sidebarService.toggleSidebar(); // Optionally close the sidebar
  }

  isActive(item: any): boolean {
    return this.activeItem === item; 
  }

}
