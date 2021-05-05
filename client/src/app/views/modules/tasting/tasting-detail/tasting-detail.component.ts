import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Tasting} from '../../../../entities/tasting';
import {TastingService} from '../../../../services/tasting.service';

@Component({
  selector: 'app-tasting-detail',
  templateUrl: './tasting-detail.component.html',
  styleUrls: ['./tasting-detail.component.scss']
})
export class TastingDetailComponent extends AbstractComponent implements OnInit {

  tasting: Tasting;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private tastingService: TastingService,
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
      data: {message: this.tasting.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.tastingService.delete(this.selectedId);
        await this.router.navigateByUrl('/tastings');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.tasting = await this.tastingService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TASTING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TASTINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TASTING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TASTING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TASTING);
  }
}
