import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  constructor(private heroservice : HeroService, private router : Router) { }
  vendors : any=[];
  showImage: boolean = false;
  imageWidth: number = 100;
  imageMargin: number = 2;

  ngOnInit(): void {
    this.heroservice.getvendors().subscribe((data:any)=>{
      this.vendors=data;
  })
  }
  editvendor(vendor:any){
    localStorage.setItem("editvendorId", vendor._id.toString());
    this.router.navigate(['/admindashboard/updatevendor']);
  }
  deletevendor(vendor:any)
    {
      alert("Do yoy want to delete the vendor")
      this.heroservice.deletevendor(vendor._id)
        .subscribe((data) => {
          this.vendors = this.vendors.filter((p: any) => p !== vendor);
        })
        this.router.navigate(['/admindashboard/vendors']);
    }

}
