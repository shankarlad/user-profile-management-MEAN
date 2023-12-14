import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IUser, UserService } from '../../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { eLocalSrorage, eRoles } from '../../sharedenums';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  data!: IUser[];
  constructor(
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  displayedColumns: string[] = [
    'name',
    'email',
    'gender',
    'strengths',
    'about',
    'actions',
  ];
  dataSource!: MatTableDataSource<IUser>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    if (!localStorage.getItem(eLocalSrorage.Token)) {
      this.router.navigate(['/login']);
    }
    let userDetails: string | null =
      localStorage.getItem(eLocalSrorage.UserDetails) || null;
    if (userDetails) {
      const UD: { userId: string; role: string; jwtToken: string } =
        JSON.parse(userDetails);
      const role = UD.role;
      if (role === eRoles.Admin) {
        this.getGridData();
      } else {
        this.router.navigate([`userform/${UD.userId}/view`]);
      }
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || 10;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onViewClick(row: IUser) {
    this.router.navigate([`/userform/${row._id}/view`]);
  }

  onUpdateClick(useId: string) {
    this.router.navigate([`/userform/${useId}/update`]);
  }

  onDeleteClick(useId: string) {
    this.userService.deleteUser(useId).subscribe(() => {
      this.toastrService.info('User Deleted');
      this.getGridData();
    });
  }

  getGridData() {
    this.userService.getAllUsers().subscribe((data) => {
      data.map((element) => {
        element.strengths = element.strength[0];
      });
      this.data = data;
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
