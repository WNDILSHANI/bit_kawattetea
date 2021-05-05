import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Gradebatch} from '../../../../entities/gradebatch';
import {GradebatchService} from '../../../../services/gradebatch.service';

@Component({
  selector: 'app-gradebatch-detail',
  templateUrl: './gradebatch-detail.component.html',
  styleUrls: ['./gradebatch-detail.component.scss']
})
export class GradebatchDetailComponent extends AbstractComponent implements OnInit {

  gradebatch: Gradebatch;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private gradebatchService: GradebatchService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.gradebatch.code + ' ' + this.gradebatch.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.gradebatchService.delete(this.selectedId);
        await this.router.navigateByUrl('/gradebatches');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.gradebatch = await this.gradebatchService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRADEBATCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRADEBATCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRADEBATCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRADEBATCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRADEBATCH);
  }
}
