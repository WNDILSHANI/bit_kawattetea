import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Grinding} from '../../../../entities/grinding';
import {GrindingService} from '../../../../services/grinding.service';

@Component({
  selector: 'app-grinding-detail',
  templateUrl: './grinding-detail.component.html',
  styleUrls: ['./grinding-detail.component.scss']
})
export class GrindingDetailComponent extends AbstractComponent implements OnInit {

  grinding: Grinding;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private grindingService: GrindingService,
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
      data: {message: this.grinding.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.grindingService.delete(this.selectedId);
        await this.router.navigateByUrl('/grindings');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.grinding = await this.grindingService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRINDING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRINDINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRINDING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRINDING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRINDING);
  }
}
