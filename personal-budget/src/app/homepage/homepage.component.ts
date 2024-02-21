import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

interface BudgetItem {
  title: string;
  budget: number;
}

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource = {
    datasets: [
      {
        data: [''],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#ff00ff',
          '#00ff00',
          '#000080',
          '#00ffff'
        ]
      }
    ],
    labels: ['']
  };

  constructor(private dataService: DataService, private el: ElementRef) { }

  ngOnInit(): void {
    this.dataService.fetchData()
      .subscribe((res: any) => {
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart();
        this.createD3Chart(res.myBudget);
      });
  }

  createChart() {
    const ctx = this.el.nativeElement.querySelector('#myChart');
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource
    });
  }

  createD3Chart(data: BudgetItem[]) {
    var width = 350;
    var height = 350;
    var radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
      .domain(data.map(d => d.title))
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var pie = d3.pie<BudgetItem>()
      .sort(null)
      .value(d => d.budget);

    var arc = d3.arc<any, d3.PieArcDatum<BudgetItem>>()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    var svg = d3.select("#d3chart")
      .append("svg")
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.title) as string);

    arcs.append("text")
      .attr("transform", d => "translate(" + arc.centroid(d) + ")")
      .text(d => d.data.title)
      .style("text-anchor", "middle")
      .style("font-size", "10px");
  }
}
