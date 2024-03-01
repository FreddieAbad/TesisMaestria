import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurepyscanComponent } from './configurepyscan.component';

describe('ConfigurepyscanComponent', () => {
  let component: ConfigurepyscanComponent;
  let fixture: ComponentFixture<ConfigurepyscanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurepyscanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurepyscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
