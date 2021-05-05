package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Distribution{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String contactpersonname;

    private String contactpersonnic;

    private String contactpersontel;

    private LocalDate date;

    private BigDecimal fee;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Sale sale;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Distributionstatus distributionstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="distributionemployee",
        joinColumns=@JoinColumn(name="distribution_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="employee_id", referencedColumnName="id")
    )
    private List<Employee> employeeList;


    public Distribution(Integer id){
        this.id = id;
    }

    public Distribution(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}