import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Permenting} from '../../../../entities/permenting';
import {PermentingService} from '../../../../services/permenting.service';

@Component({
  selector: 'app-permenting-detail',
  templateUrl: './permenting-detail.component.html',
  styleUrls: ['./permenting-detail.component.scss']
})
export class PermentingDetailComponent extends AbstractComponent implements OnInit {

  permenting: Permenting;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private permentingService: PermentingService,
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
      data: {message: this.permenting.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.permentingService.delete(this.selectedId);
        await this.router.navigateByUrl('/permentings');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.permenting = await this.permentingService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PERMENTING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PERMENTINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PERMENTING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PERMENTING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PERMENTING);
  }
}
