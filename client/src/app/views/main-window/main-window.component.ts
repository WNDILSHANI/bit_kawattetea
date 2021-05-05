import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const userLink = new LinkItem('User Management', '', 'admin_panel_settings');
    const roleLink = new LinkItem('Role Management', '', 'assignment_ind');

    const saleLink = new LinkItem('Sale Management', '/', 'trip_origin');
    const witheringLink = new LinkItem('Withering Management', '/', 'trip_origin');
    const customerLink = new LinkItem('Customer Management', '/', 'trip_origin');
    const productLink = new LinkItem('Product Management', '/', 'trip_origin');
    const customerrefundLink = new LinkItem('Customerrefund Management', '/', 'trip_origin');
    const disposalLink = new LinkItem('Disposal Management', '/', 'trip_origin');
    const grindingLink = new LinkItem('Grinding Management', '/', 'trip_origin');
    const vehicleLink = new LinkItem('Vehicle Management', '/', 'trip_origin');
    const supplierpaymentLink = new LinkItem('Supplierpayment Management', '/', 'trip_origin');
    const packingLink = new LinkItem('Packing Management', '/', 'trip_origin');
    const supplierLink = new LinkItem('Supplier Management', '/', 'trip_origin');
    const categorizationLink = new LinkItem('Categorization Management', '/', 'trip_origin');
    const categorizedmaterialLink = new LinkItem('Categorizedmaterial Management', '/', 'trip_origin');
    const gradebatchLink = new LinkItem('Gradebatch Management', '/', 'trip_origin');
    const tastingLink = new LinkItem('Tasting Management', '/', 'trip_origin');
    const materialLink = new LinkItem('Material Management', '/', 'trip_origin');
    const porderLink = new LinkItem('Porder Management', '/', 'trip_origin');
    const employeeLink = new LinkItem('Employee Management', '/', 'trip_origin');
    const distributionLink = new LinkItem('Distribution Management', '/', 'trip_origin');
    const productdisposalLink = new LinkItem('Productdisposal Management', '/', 'trip_origin');
    const collectionLink = new LinkItem('Collection Management', '/', 'trip_origin');
    const permentingLink = new LinkItem('Permenting Management', '/', 'trip_origin');
    const customerpaymentLink = new LinkItem('Customerpayment Management', '/', 'trip_origin');
    const inventoryLink = new LinkItem('Inventory Management', '/', 'trip_origin');
    const dryeringLink = new LinkItem('Dryering Management', '/', 'trip_origin');

    const showUserLink = new LinkItem('Show All Users', '/users', 'list');
    showUserLink.addUsecaseId(UsecaseList.SHOW_ALL_USERS);
    userLink.children.push(showUserLink);

    const addUserLink = new LinkItem('Add New User', '/users/add', 'add');
    addUserLink.addUsecaseId(UsecaseList.ADD_USER);
    userLink.children.push(addUserLink);

    const showRoleLink = new LinkItem('Show All Roles', '/roles', 'list');
    showRoleLink.addUsecaseId(UsecaseList.SHOW_ALL_ROLES);
    roleLink.children.push(showRoleLink);

    const addRoleLink = new LinkItem('Add New Role', '/roles/add', 'add');
    addRoleLink.addUsecaseId(UsecaseList.ADD_ROLE);
    roleLink.children.push(addRoleLink);

    const addNewSaleLink = new LinkItem('Add New Sale', 'sales/add', 'add');
    addNewSaleLink.addUsecaseId(UsecaseList.ADD_SALE);
    saleLink.children.push(addNewSaleLink);

    const showAllSaleLink = new LinkItem('Show All Sale', 'sales', 'list');
    showAllSaleLink.addUsecaseId(UsecaseList.SHOW_ALL_SALES);
    saleLink.children.push(showAllSaleLink);

    const addNewWitheringLink = new LinkItem('Add New Withering', 'witherings/add', 'add');
    addNewWitheringLink.addUsecaseId(UsecaseList.ADD_WITHERING);
    witheringLink.children.push(addNewWitheringLink);

    const showAllWitheringLink = new LinkItem('Show All Withering', 'witherings', 'list');
    showAllWitheringLink.addUsecaseId(UsecaseList.SHOW_ALL_WITHERINGS);
    witheringLink.children.push(showAllWitheringLink);

    const addNewCustomerLink = new LinkItem('Add New Customer', 'customers/add', 'add');
    addNewCustomerLink.addUsecaseId(UsecaseList.ADD_CUSTOMER);
    customerLink.children.push(addNewCustomerLink);

    const showAllCustomerLink = new LinkItem('Show All Customer', 'customers', 'list');
    showAllCustomerLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERS);
    customerLink.children.push(showAllCustomerLink);

    const addNewProductLink = new LinkItem('Add New Product', 'products/add', 'add');
    addNewProductLink.addUsecaseId(UsecaseList.ADD_PRODUCT);
    productLink.children.push(addNewProductLink);

    const showAllProductLink = new LinkItem('Show All Product', 'products', 'list');
    showAllProductLink.addUsecaseId(UsecaseList.SHOW_ALL_PRODUCTS);
    productLink.children.push(showAllProductLink);

    const addNewCustomerrefundLink = new LinkItem('Add New Customerrefund', 'customerrefunds/add', 'add');
    addNewCustomerrefundLink.addUsecaseId(UsecaseList.ADD_CUSTOMERREFUND);
    customerrefundLink.children.push(addNewCustomerrefundLink);

    const showAllCustomerrefundLink = new LinkItem('Show All Customerrefund', 'customerrefunds', 'list');
    showAllCustomerrefundLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);
    customerrefundLink.children.push(showAllCustomerrefundLink);

    const addNewDisposalLink = new LinkItem('Add New Disposal', 'disposals/add', 'add');
    addNewDisposalLink.addUsecaseId(UsecaseList.ADD_DISPOSAL);
    disposalLink.children.push(addNewDisposalLink);

    const showAllDisposalLink = new LinkItem('Show All Disposal', 'disposals', 'list');
    showAllDisposalLink.addUsecaseId(UsecaseList.SHOW_ALL_DISPOSALS);
    disposalLink.children.push(showAllDisposalLink);

    const addNewGrindingLink = new LinkItem('Add New Grinding', 'grindings/add', 'add');
    addNewGrindingLink.addUsecaseId(UsecaseList.ADD_GRINDING);
    grindingLink.children.push(addNewGrindingLink);

    const showAllGrindingLink = new LinkItem('Show All Grinding', 'grindings', 'list');
    showAllGrindingLink.addUsecaseId(UsecaseList.SHOW_ALL_GRINDINGS);
    grindingLink.children.push(showAllGrindingLink);

    const addNewVehicleLink = new LinkItem('Add New Vehicle', 'vehicles/add', 'add');
    addNewVehicleLink.addUsecaseId(UsecaseList.ADD_VEHICLE);
    vehicleLink.children.push(addNewVehicleLink);

    const showAllVehicleLink = new LinkItem('Show All Vehicle', 'vehicles', 'list');
    showAllVehicleLink.addUsecaseId(UsecaseList.SHOW_ALL_VEHICLES);
    vehicleLink.children.push(showAllVehicleLink);

    const addNewSupplierpaymentLink = new LinkItem('Add New Supplierpayment', 'supplierpayments/add', 'add');
    addNewSupplierpaymentLink.addUsecaseId(UsecaseList.ADD_SUPPLIERPAYMENT);
    supplierpaymentLink.children.push(addNewSupplierpaymentLink);

    const showAllSupplierpaymentLink = new LinkItem('Show All Supplierpayment', 'supplierpayments', 'list');
    showAllSupplierpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    supplierpaymentLink.children.push(showAllSupplierpaymentLink);

    const addNewPackingLink = new LinkItem('Add New Packing', 'packings/add', 'add');
    addNewPackingLink.addUsecaseId(UsecaseList.ADD_PACKING);
    packingLink.children.push(addNewPackingLink);

    const showAllPackingLink = new LinkItem('Show All Packing', 'packings', 'list');
    showAllPackingLink.addUsecaseId(UsecaseList.SHOW_ALL_PACKINGS);
    packingLink.children.push(showAllPackingLink);

    const addNewSupplierLink = new LinkItem('Add New Supplier', 'suppliers/add', 'add');
    addNewSupplierLink.addUsecaseId(UsecaseList.ADD_SUPPLIER);
    supplierLink.children.push(addNewSupplierLink);

    const showAllSupplierLink = new LinkItem('Show All Supplier', 'suppliers', 'list');
    showAllSupplierLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERS);
    supplierLink.children.push(showAllSupplierLink);

    const addNewCategorizationLink = new LinkItem('Add New Categorization', 'categorizations/add', 'add');
    addNewCategorizationLink.addUsecaseId(UsecaseList.ADD_CATEGORIZATION);
    categorizationLink.children.push(addNewCategorizationLink);

    const showAllCategorizationLink = new LinkItem('Show All Categorization', 'categorizations', 'list');
    showAllCategorizationLink.addUsecaseId(UsecaseList.SHOW_ALL_CATEGORIZATIONS);
    categorizationLink.children.push(showAllCategorizationLink);

    const addNewCategorizedmaterialLink = new LinkItem('Add New Categorizedmaterial', 'categorizedmaterials/add', 'add');
    addNewCategorizedmaterialLink.addUsecaseId(UsecaseList.ADD_CATEGORIZEDMATERIAL);
    categorizedmaterialLink.children.push(addNewCategorizedmaterialLink);

    const showAllCategorizedmaterialLink = new LinkItem('Show All Categorizedmaterial', 'categorizedmaterials', 'list');
    showAllCategorizedmaterialLink.addUsecaseId(UsecaseList.SHOW_ALL_CATEGORIZEDMATERIALS);
    categorizedmaterialLink.children.push(showAllCategorizedmaterialLink);

    const addNewGradebatchLink = new LinkItem('Add New Gradebatch', 'gradebatches/add', 'add');
    addNewGradebatchLink.addUsecaseId(UsecaseList.ADD_GRADEBATCH);
    gradebatchLink.children.push(addNewGradebatchLink);

    const showAllGradebatchLink = new LinkItem('Show All Gradebatch', 'gradebatches', 'list');
    showAllGradebatchLink.addUsecaseId(UsecaseList.SHOW_ALL_GRADEBATCHES);
    gradebatchLink.children.push(showAllGradebatchLink);

    const addNewTastingLink = new LinkItem('Add New Tasting', 'tastings/add', 'add');
    addNewTastingLink.addUsecaseId(UsecaseList.ADD_TASTING);
    tastingLink.children.push(addNewTastingLink);

    const showAllTastingLink = new LinkItem('Show All Tasting', 'tastings', 'list');
    showAllTastingLink.addUsecaseId(UsecaseList.SHOW_ALL_TASTINGS);
    tastingLink.children.push(showAllTastingLink);

    const addNewMaterialLink = new LinkItem('Add New Material', 'materials/add', 'add');
    addNewMaterialLink.addUsecaseId(UsecaseList.ADD_MATERIAL);
    materialLink.children.push(addNewMaterialLink);

    const showAllMaterialLink = new LinkItem('Show All Material', 'materials', 'list');
    showAllMaterialLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALS);
    materialLink.children.push(showAllMaterialLink);

    const addNewPorderLink = new LinkItem('Add New Porder', 'porders/add', 'add');
    addNewPorderLink.addUsecaseId(UsecaseList.ADD_PORDER);
    porderLink.children.push(addNewPorderLink);

    const showAllPorderLink = new LinkItem('Show All Porder', 'porders', 'list');
    showAllPorderLink.addUsecaseId(UsecaseList.SHOW_ALL_PORDERS);
    porderLink.children.push(showAllPorderLink);

    const addNewEmployeeLink = new LinkItem('Add New Employee', 'employees/add', 'add');
    addNewEmployeeLink.addUsecaseId(UsecaseList.ADD_EMPLOYEE);
    employeeLink.children.push(addNewEmployeeLink);

    const showAllEmployeeLink = new LinkItem('Show All Employee', 'employees', 'list');
    showAllEmployeeLink.addUsecaseId(UsecaseList.SHOW_ALL_EMPLOYEES);
    employeeLink.children.push(showAllEmployeeLink);

    const addNewDistributionLink = new LinkItem('Add New Distribution', 'distributions/add', 'add');
    addNewDistributionLink.addUsecaseId(UsecaseList.ADD_DISTRIBUTION);
    distributionLink.children.push(addNewDistributionLink);

    const showAllDistributionLink = new LinkItem('Show All Distribution', 'distributions', 'list');
    showAllDistributionLink.addUsecaseId(UsecaseList.SHOW_ALL_DISTRIBUTIONS);
    distributionLink.children.push(showAllDistributionLink);

    const addNewProductdisposalLink = new LinkItem('Add New Productdisposal', 'productdisposals/add', 'add');
    addNewProductdisposalLink.addUsecaseId(UsecaseList.ADD_PRODUCTDISPOSAL);
    productdisposalLink.children.push(addNewProductdisposalLink);

    const showAllProductdisposalLink = new LinkItem('Show All Productdisposal', 'productdisposals', 'list');
    showAllProductdisposalLink.addUsecaseId(UsecaseList.SHOW_ALL_PRODUCTDISPOSALS);
    productdisposalLink.children.push(showAllProductdisposalLink);

    const addNewCollectionLink = new LinkItem('Add New Collection', 'collections/add', 'add');
    addNewCollectionLink.addUsecaseId(UsecaseList.ADD_COLLECTION);
    collectionLink.children.push(addNewCollectionLink);

    const showAllCollectionLink = new LinkItem('Show All Collection', 'collections', 'list');
    showAllCollectionLink.addUsecaseId(UsecaseList.SHOW_ALL_COLLECTIONS);
    collectionLink.children.push(showAllCollectionLink);

    const addNewPermentingLink = new LinkItem('Add New Permenting', 'permentings/add', 'add');
    addNewPermentingLink.addUsecaseId(UsecaseList.ADD_PERMENTING);
    permentingLink.children.push(addNewPermentingLink);

    const showAllPermentingLink = new LinkItem('Show All Permenting', 'permentings', 'list');
    showAllPermentingLink.addUsecaseId(UsecaseList.SHOW_ALL_PERMENTINGS);
    permentingLink.children.push(showAllPermentingLink);

    const addNewCustomerpaymentLink = new LinkItem('Add New Customerpayment', 'customerpayments/add', 'add');
    addNewCustomerpaymentLink.addUsecaseId(UsecaseList.ADD_CUSTOMERPAYMENT);
    customerpaymentLink.children.push(addNewCustomerpaymentLink);

    const showAllCustomerpaymentLink = new LinkItem('Show All Customerpayment', 'customerpayments', 'list');
    showAllCustomerpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    customerpaymentLink.children.push(showAllCustomerpaymentLink);

    const addNewInventoryLink = new LinkItem('Add New Inventory', 'inventories/add', 'add');
    addNewInventoryLink.addUsecaseId(UsecaseList.ADD_INVENTORY);
    inventoryLink.children.push(addNewInventoryLink);

    const showAllInventoryLink = new LinkItem('Show All Inventory', 'inventories', 'list');
    showAllInventoryLink.addUsecaseId(UsecaseList.SHOW_ALL_INVENTORIES);
    inventoryLink.children.push(showAllInventoryLink);

    const addNewDryeringLink = new LinkItem('Add New Dryering', 'dryerings/add', 'add');
    addNewDryeringLink.addUsecaseId(UsecaseList.ADD_DRYERING);
    dryeringLink.children.push(addNewDryeringLink);

    const showAllDryeringLink = new LinkItem('Show All Dryering', 'dryerings', 'list');
    showAllDryeringLink.addUsecaseId(UsecaseList.SHOW_ALL_DRYERINGS);
    dryeringLink.children.push(showAllDryeringLink);

    this.linkItems.push(dashboardLink);
    this.linkItems.push(userLink);
    this.linkItems.push(roleLink);
    this.linkItems.push(saleLink);
    this.linkItems.push(witheringLink);
    this.linkItems.push(customerLink);
    this.linkItems.push(productLink);
    this.linkItems.push(customerrefundLink);
    this.linkItems.push(disposalLink);
    this.linkItems.push(grindingLink);
    this.linkItems.push(vehicleLink);
    this.linkItems.push(supplierpaymentLink);
    this.linkItems.push(packingLink);
    this.linkItems.push(supplierLink);
    this.linkItems.push(categorizationLink);
    this.linkItems.push(categorizedmaterialLink);
    this.linkItems.push(gradebatchLink);
    this.linkItems.push(tastingLink);
    this.linkItems.push(materialLink);
    this.linkItems.push(porderLink);
    this.linkItems.push(employeeLink);
    this.linkItems.push(distributionLink);
    this.linkItems.push(productdisposalLink);
    this.linkItems.push(collectionLink);
    this.linkItems.push(permentingLink);
    this.linkItems.push(customerpaymentLink);
    this.linkItems.push(inventoryLink);
    this.linkItems.push(dryeringLink);

  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(true);
      this.isDark = true;
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
