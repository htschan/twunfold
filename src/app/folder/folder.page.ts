import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwclientService } from '../services/twclient.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(public twClient: TwclientService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  addMessage(message) {
    this.twClient.addMessage(message);
  }
}
