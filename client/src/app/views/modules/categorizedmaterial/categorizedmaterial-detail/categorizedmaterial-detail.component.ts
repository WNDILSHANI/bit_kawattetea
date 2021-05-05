import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';

@Component({
  selector: 'app-categorizedmaterial-detail',
  templateUrl: './categorizedmaterial-detail.component.html',
  styleUrls: ['./categorizedmaterial-detail.component.scss']
})
export class CategorizedmaterialDetailComponent extends AbstractComponent implements OnInit {

  categorizedmaterial: Categorizedmaterial;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private categorizedmaterialService: CategorizedmaterialService,
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
      data: {message: this.categorizedmaterial.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.categorizedmaterialService.delete(this.selectedId);
        await this.router.navigateByUrl('/categorizedmaterials');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.categorizedmaterial = await this.categorizedmaterialService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CATEGORIZEDMATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CATEGORIZEDMATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CATEGORIZEDMATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CATEGORIZEDMATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CATEGORIZEDMATERIAL);
  }
}
