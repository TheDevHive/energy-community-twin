import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../services/community.service';
import { Building } from '../../models/building';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBuildingComponent } from '../add-building/add-building.component';
import { Community } from '../../models/community';
import { BuildingService } from '../../services/building.service';
import { Location } from '@angular/common';
import { Apartment } from '../../models/apartment';

@Component({
  selector: 'app-overview-template',
  templateUrl: './overview-template.component.html',
  styleUrls: ['./overview-template.component.css']
})
export class OverviewTemplateComponent implements OnInit {

  communityId?: number;
  buildings: Building[] = [];
  apartments: Apartment[] = [];

  currentCommunity?: Community;
  currentBuilding?: Building;

  name: string = '';
  reportContent: string = 'Your Summary Goes Here';

  currentVisualization: string = '';

  constructor(
    private location: Location,
    private commService: CommunityService,
    private buildingService: BuildingService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {}

  // since the html for this component is a template for 
  // visualizing different stuff, one must know what
  // is asked to visualize (by looking at the URL)
  //
  // the idea is the following: you get to this component, and
  // you look at the source that brought you there.
  // does the origin URL contain the parameter `id`? Then maybe it's a
  // community, but then you have to ask again: does the origin URL also contain
  // `buildingId`? Then maybe you're visualizing the apartments of a building,
  // and so on...
  // 
  // when you want to load different data, in the appropriate switch-case branch
  // you simply call some function that will call some service (e.g. loadBuildings
  // loadApartments, loadDevices, ...)
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const communityID = params.get('id');
      const buildingID = params.get('buildingId');
      // const apartmentID = params.get('apartmentId');

      if (!communityID) return;
  
      this.loadCommunity(+communityID, buildingID);
    });
  }
  
  // here we load the community and we check if in the origin URL we found
  // the `buildingId` parameter: if so, this mean that the admin clicked
  // on a building card in the community view, so now we need to visualize
  // the apartments of that building. Otherwise (Outer Wilds) we just need to 
  // visualize the buildings that belong to the community.
  private loadCommunity(communityID: number, buildingID: string | null) {
    this.commService.getCommunity(communityID).subscribe(
      (community: Community) => {
        this.currentCommunity = community;
        this.name = "Community name: " + community.name;
  
        if (buildingID == null) {
          this.loadAllBuildings(communityID);
        } 
        else {
          this.loadApartments(+buildingID);
        }

      },
      (error) => {
        console.error('Error fetching community:', error);
      }
    );
  }
  
  private loadAllBuildings(communityID: number) {

    this.commService.getBuildings(communityID).subscribe(
      (buildings: Building[]) => {
        this.buildings = buildings;
        this.currentVisualization = 'Community';
      },
      (error) => {
        console.error('Error fetching buildings:', error);
      }
    );

  }
  
  private loadApartments(buildingID: number) {

    this.name = 'Building ID: ' + buildingID;
    this.buildingService.getApartments(buildingID).subscribe(
      (apartments: Apartment[]) => {
        this.apartments = apartments;
        this.currentVisualization = 'Building';
      },
      (error) => {
        console.error('Error fetching apartments:', error);
      }
    );

  }
  

  goBack(): void {
    this.location.back();
  }  

  addCard(): void {
    const modalRef = this.modalService.open(AddBuildingComponent);

    modalRef.result.then(
      (pBuilding: Partial<Building>) => {
        if (pBuilding && this.currentCommunity) {
          pBuilding.community = this.currentCommunity;

          this.buildingService.createBuilding(pBuilding).subscribe(
            (newBuilding: Building) => {
              console.log('Building created successfully:', JSON.stringify(newBuilding));
              this.buildings.push(newBuilding);
            },
            (error) => {
              if (error.status === 400) {
                console.error('Bad Request: ', error.message);
              } else if (error.status === 401) {
                console.error('Unauthorized: ', error.message);
              } else if (error.status === 500) {
                console.error('Internal Server Error: ', error.message);
              } else {
                console.error('Unknown error: ', error);
              }
            }
          );
        }
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    ).catch((error) => {
      console.error('Error opening modal:', error);
    });
  }

  changeVisualization(id: number) {
    switch (this.currentVisualization) 
    {
      case 'Community':
        if (this.currentCommunity) {
          this.router.navigate(['/communities', this.currentCommunity.id, 'buildings', id]);
        }
        break;
    }
  }
  

}
