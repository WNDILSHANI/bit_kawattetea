import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Categorizedmaterial, CategorizedmaterialDataPage} from '../../../../entities/categorizedmaterial';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';

@Component({
  selector: 'app-categorizedmaterial-table',
  templateUrl: './categorizedmaterial-table.component.html',
  styleUrls: ['./categorizedmaterial-table.component.scss']
})
export class CategorizedmaterialTableComponent extends AbstractComponent implements OnInit {

  categorizedmaterialDataPage: CategorizedmaterialDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();

  constructor(
    private categorizedmaterialService: CategorizedmaterialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);


    this.categorizedmaterialService.getAll(pageRequest).then((page: CategorizedmaterialDataPage) => {
      this.categorizedmaterialDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CATEGORIZEDMATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CATEGORIZEDMATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CATEGORIZEDMATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CATEGORIZEDMATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CATEGORIZEDMATERIAL);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(categorizedmaterial: Categorizedmaterial): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: categorizedmaterial.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.categorizedmaterialService.delete(categorizedmaterial.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
