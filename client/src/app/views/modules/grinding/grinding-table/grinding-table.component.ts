import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Grinding, GrindingDataPage} from '../../../../entities/grinding';
import {GrindingService} from '../../../../services/grinding.service';

@Component({
  selector: 'app-grinding-table',
  templateUrl: './grinding-table.component.html',
  styleUrls: ['./grinding-table.component.scss']
})
export class GrindingTableComponent extends AbstractComponent implements OnInit {

  grindingDataPage: GrindingDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();

  constructor(
    private grindingService: GrindingService,
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


    this.grindingService.getAll(pageRequest).then((page: GrindingDataPage) => {
      this.grindingDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRINDING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRINDINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRINDING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRINDING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRINDING);
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

  async delete(grinding: Grinding): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: grinding.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.grindingService.delete(grinding.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
