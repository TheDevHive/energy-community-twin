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
import { CommunitySummaryComponent } from '../community-summary/community-summary.component';

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
  currentApartment?: Apartment;

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

  ngOnInit() {
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
    this.route.paramMap.subscribe(params => {
      const communityID = params.get('id');
      const buildingID = params.get('buildingId');
    
      if (communityID) this.currentVisualization = 'Community';
      if (buildingID) this.currentVisualization = 'Building';
    
      switch (this.currentVisualization) {
        case 'Community':
          this.commService.getCommunity(+communityID!).subscribe(
            (community) => {
              this.currentCommunity = community;
              this.name = this.currentCommunity.name;
              this.loadBuildings(this.currentCommunity.id);
            },
            (error) => {
              console.error('Error fetching community:', error);
            }
          );
          break;
    
        case 'Building':
          this.commService.getCommunity(+communityID!).subscribe(
            (community) => {
              this.currentCommunity = community;
    
              this.buildingService.getBuilding(+buildingID!).subscribe(
                (building) => {
                  this.currentBuilding = building;
                },
                (error) => {
                  console.error('Error fetching building:', error);
                }
              );
            },
            (error) => {
              console.error('Error fetching community:', error);
            }
          );
          break;
    
        default:
          console.warn('No valid visualization type found.');
          break;
      }
    });   

  }

  goBack(): void {
    this.location.back();
  }  

  loadBuildings(communityId: number): void {
    this.commService.getBuildings(communityId).subscribe(
      (buildings: Building[]) => {
        this.buildings = buildings;
      },
      (error) => {
        console.error('Error fetching buildings:', error);
      }
    );
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
