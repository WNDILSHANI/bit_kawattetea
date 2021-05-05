package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Material{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private BigDecimal unitprice;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Tealeaftype tealeaftype;

    @ManyToOne
    private Teatreetype teatreetype;

    @ManyToOne
    private Materialstatus materialstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Categorizedmaterial> materialCategorizedmaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Collection> materialCollectionList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Productmaterial> productmaterialList;


    public Material(Integer id){
        this.id = id;
    }

    public Material(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}