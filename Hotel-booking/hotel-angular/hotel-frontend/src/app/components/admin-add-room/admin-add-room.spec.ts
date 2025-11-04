import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddRoom } from './admin-add-room';

describe('AdminAddRoom', () => {
  let component: AdminAddRoom;
  let fixture: ComponentFixture<AdminAddRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddRoom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddRoom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
