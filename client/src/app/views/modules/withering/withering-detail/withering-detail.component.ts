import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Withering} from '../../../../entities/withering';
import {WitheringService} from '../../../../services/withering.service';

@Component({
  selector: 'app-withering-detail',
  templateUrl: './withering-detail.component.html',
  styleUrls: ['./withering-detail.component.scss']
})
export class WitheringDetailComponent extends AbstractComponent implements OnInit {

  withering: Withering;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private witheringService: WitheringService,
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
      data: {message: this.withering.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.witheringService.delete(this.selectedId);
        await this.router.navigateByUrl('/witherings');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.withering = await this.witheringService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_WITHERING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_WITHERINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_WITHERING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_WITHERING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_WITHERING);
  }
}
