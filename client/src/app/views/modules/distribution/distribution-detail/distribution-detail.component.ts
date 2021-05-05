import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Distribution} from '../../../../entities/distribution';
import {DistributionService} from '../../../../services/distribution.service';

@Component({
  selector: 'app-distribution-detail',
  templateUrl: './distribution-detail.component.html',
  styleUrls: ['./distribution-detail.component.scss']
})
export class DistributionDetailComponent extends AbstractComponent implements OnInit {

  distribution: Distribution;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private distributionService: DistributionService,
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
      data: {message: this.distribution.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.distributionService.delete(this.selectedId);
        await this.router.navigateByUrl('/distributions');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.distribution = await this.distributionService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISTRIBUTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISTRIBUTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISTRIBUTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISTRIBUTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISTRIBUTION);
  }
}
