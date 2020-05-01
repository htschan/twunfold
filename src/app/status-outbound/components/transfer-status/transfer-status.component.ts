import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DtoTransferStatus, TwclientService } from 'src/app/services/twclient.service';

@Component({
  selector: 'app-transfer-status',
  templateUrl: './transfer-status.component.html',
  styleUrls: ['./transfer-status.component.scss'],
})
export class TransferStatusComponent implements OnInit {
  @Input() states: DtoTransferStatus[];
  @Input() sourceAccount: string;
  @Output() cancelled = new EventEmitter<number>();

  constructor(public twClient: TwclientService) { }

  ngOnInit() { }

  cancelTransfer(id: number) {
    this.cancelled.emit(id);
  }
}
