package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Categorization{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDateTime tostart;

    private LocalDateTime toend;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Categorizationstatus categorizationstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "categorization")
    private List<Categorizedmaterial> categorizationCategorizedmaterialList;


    @ManyToMany
        @JoinTable(
        name="categorizationemployee",
        joinColumns=@JoinColumn(name="categorization_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="employee_id", referencedColumnName="id")
    )
    private List<Employee> employeeList;

    @ManyToMany
        @JoinTable(
        name="categorizationcollection",
        joinColumns=@JoinColumn(name="categorization_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="collection_id", referencedColumnName="id")
    )
    private List<Collection> collectionList;


    public Categorization(Integer id){
        this.id = id;
    }

    public Categorization(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}