import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Gradebatch, GradebatchDataPage} from '../../../../entities/gradebatch';
import {GradebatchService} from '../../../../services/gradebatch.service';
import {Grade} from '../../../../entities/grade';
import {GradeService} from '../../../../services/grade.service';

@Component({
  selector: 'app-gradebatch-table',
  templateUrl: './gradebatch-table.component.html',
  styleUrls: ['./gradebatch-table.component.scss']
})
export class GradebatchTableComponent extends AbstractComponent implements OnInit {

  gradebatchDataPage: GradebatchDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  grades: Grade[] = [];

  codeField = new FormControl();
  gradeField = new FormControl();
  nameField = new FormControl();

  constructor(
    private gradeService: GradeService,
    private gradebatchService: GradebatchService,
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
    pageRequest.addSearchCriteria('grade', this.gradeField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);

    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.gradebatchService.getAll(pageRequest).then((page: GradebatchDataPage) => {
      this.gradebatchDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRADEBATCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRADEBATCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRADEBATCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRADEBATCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRADEBATCH);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'grade', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(gradebatch: Gradebatch): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: gradebatch.code + ' ' + gradebatch.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.gradebatchService.delete(gradebatch.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
